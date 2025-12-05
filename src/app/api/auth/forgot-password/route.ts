import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { message: "Email é obrigatório" },
                { status: 400 }
            );
        }

        // Validação básica de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Email inválido" },
                { status: 400 }
            );
        }

        // Busca usuário por email usando SQL raw (funciona mesmo sem regenerar Prisma Client)
        const emailLower = email.trim().toLowerCase();
        const users = await prisma.$queryRawUnsafe<Array<{
            id: number;
            name: string;
            username: string;
            email: string | null;
        }>>(
            "SELECT id, name, username, email FROM \"User\" WHERE LOWER(email) = $1 LIMIT 1",
            emailLower
        );

        // Por segurança, não revelamos se o email existe ou não
        // Sempre retornamos sucesso, mas só enviamos email se o usuário existir
        if (!users || users.length === 0) {
            return NextResponse.json(
                { message: "Se o email existir, um link de recuperação será enviado." },
                { status: 200 }
            );
        }

        const user = users[0];

        // Gera um token seguro
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expira em 1 hora

        // Salva o token no banco de dados usando SQL raw
        await prisma.$executeRawUnsafe(
            "UPDATE \"User\" SET \"resetToken\" = $1, \"resetTokenExpiry\" = $2 WHERE id = $3",
            resetToken, resetTokenExpiry, user.id
        );

        // Envia o email com o link de recuperação
        const userEmail = user.email || emailLower;
        try {
            await sendResetPasswordEmail({
                email: userEmail,
                resetToken,
                userName: user.name,
            });
            console.log(`Email de recuperação enviado com sucesso para: ${userEmail}`);
        } catch (emailError: unknown) {
            console.error("Erro ao enviar email:", emailError);
            // Em desenvolvimento, podemos retornar o erro para debug
            // Em produção, não revelamos isso ao usuário por segurança
            if (process.env.NODE_ENV === "development") {
                const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
                console.error("Detalhes do erro de email:", errorMessage);
            }
            // Mesmo se o email falhar, não revelamos isso ao usuário por segurança
            // Mas logamos o erro para debug
        }

        return NextResponse.json(
            {
                message: "Se o email existir, um link de recuperação será enviado.",
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

