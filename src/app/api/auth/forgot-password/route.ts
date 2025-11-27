import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json(
                { message: "Usuário é obrigatório" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            // Por segurança, não revelamos se o usuário existe ou não
            return NextResponse.json(
                { message: "Se o usuário existir, um token de recuperação será gerado." },
                { status: 200 }
            );
        }

        // Gera um token seguro
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expira em 1 hora

        // Salva o token no banco de dados usando SQL raw
        await prisma.$executeRaw`
            UPDATE "User" 
            SET "resetToken" = ${resetToken}, "resetTokenExpiry" = ${resetTokenExpiry} 
            WHERE id = ${user.id}
        `;

        // Em produção, aqui você enviaria um email com o token
        // Por enquanto, retornamos o token na resposta para desenvolvimento
        return NextResponse.json(
            {
                message: "Token de recuperação gerado com sucesso",
                token: resetToken, // Em produção, remover esta linha e enviar por email
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao gerar token de recuperação:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

