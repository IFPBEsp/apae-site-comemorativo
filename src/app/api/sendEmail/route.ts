import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
	try {
		const { nome, email, telefone, assunto, mensagem } = await request.json();

		// 1. Configura o Transporter (o carteiro do Gmail)
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		});

		// 2. Configura o E-mail
		const mailOptions = {
			from: process.env.GMAIL_USER, // Quem envia (seu backend)
			to: process.env.GMAIL_USER, // Quem recebe (você ou o admin)
			replyTo: email, // Se você clicar em "responder", vai para o email do usuário
			subject: `Novo Contato: ${assunto || "Sem assunto"}`,
			text: `
        Nome: ${nome}
        Email: ${email}
        Telefone: ${telefone}
        
        Mensagem:
        ${mensagem}
      `,
			// html: '<b>Você pode usar HTML aqui se quiser</b>'
		};

		// 3. Envia
		await transporter.sendMail(mailOptions);

		return NextResponse.json({ message: "E-mail enviado com sucesso!" }, { status: 200 });

	} catch (error) {
		console.error("Erro ao enviar e-mail:", error);
		return NextResponse.json({ message: "Erro ao enviar e-mail." }, { status: 500 });
	}
}