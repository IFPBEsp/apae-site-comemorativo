import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const nome = formData.get("nome") as string;
        const email = formData.get("email") as string;
        const telefone = formData.get("telefone") as string;
        const assunto = formData.get("assunto") as string;
        const mensagem = formData.get("mensagem") as string;
        const anexo = formData.get("anexo") as File | null;

        let attachments = [];

        if (anexo) {
            const buffer = Buffer.from(await anexo.arrayBuffer());
            attachments.push({
                filename: anexo.name,
                content: buffer,
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: assunto,
            text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}\nTelefone: ${telefone}`, attachments,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log("Erro ao enviar email: ", error);

        return NextResponse.json({ success: false }, { status: 500 });
    }
}