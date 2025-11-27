import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json(
                { message: "Token e nova senha são obrigatórios" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { message: "A senha deve ter pelo menos 6 caracteres" },
                { status: 400 }
            );
        }

        // Busca o usuário pelo token usando SQL raw
        const users = await prisma.$queryRaw<Array<{ id: number }>>`
            SELECT id FROM "User" 
            WHERE "resetToken" = ${token} 
            AND "resetTokenExpiry" > ${new Date()}
            LIMIT 1
        `;

        if (!users || users.length === 0) {
            return NextResponse.json(
                { message: "Token inválido ou expirado. Solicite um novo token." },
                { status: 400 }
            );
        }

        const userId = users[0].id;

        // Hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza a senha e remove o token de reset
        await prisma.$executeRaw`
            UPDATE "User" 
            SET password = ${hashedPassword}, "resetToken" = NULL, "resetTokenExpiry" = NULL 
            WHERE id = ${userId}
        `;

        return NextResponse.json(
            { message: "Senha redefinida com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao resetar senha:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

