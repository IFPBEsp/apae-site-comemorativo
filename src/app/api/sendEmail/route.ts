import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface MailAttachment {
	filename: string;
	content: Buffer;
	contentType: string;
}

export async function POST(request: Request) {
	try {
		// Ler o FormData em vez de JSON
		const formData = await request.formData();

		const nome = formData.get("nome") as string;
		const email = formData.get("email") as string;
		const telefone = formData.get("telefone") as string;
		const assunto = formData.get("assunto") as string;
		const mensagem = formData.get("mensagem") as string;
		const arquivo = formData.get("arquivo") as File | null;

		const attachments: MailAttachment[] = [];

		if (arquivo && arquivo.size > 0) {
			console.log("Processando anexo:", arquivo.name);
			const bytes = await arquivo.arrayBuffer();
			const buffer = Buffer.from(bytes);

			attachments.push({
				filename: arquivo.name,
				content: buffer,
				contentType: arquivo.type,
			});
		}

		console.log("Total de anexos preparados:", attachments.length);

		// Configura o Transporter (o carteiro do Gmail)
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		});

		// Configura o E-mail
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
			attachments: attachments,
		};

		// Envia
		await transporter.sendMail(mailOptions);

		return NextResponse.json({ message: "E-mail enviado com sucesso!" }, { status: 200 });
	} catch (error) {
		console.error("Erro ao enviar e-mail:", error);
		return NextResponse.json({ message: "Erro ao enviar e-mail." }, { status: 500 });
	}
}