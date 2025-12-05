import nodemailer from "nodemailer";

interface SendResetPasswordEmailParams {
    email: string;
    resetToken: string;
    userName?: string;
}

export async function sendResetPasswordEmail({
    email,
    resetToken,
    userName,
}: SendResetPasswordEmailParams): Promise<void> {
    // Verifica se as credenciais SMTP estão configuradas
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
        console.error("Credenciais SMTP não configuradas. Configure SMTP_USER e SMTP_PASS nas variáveis de ambiente.");
        throw new Error("Configuração de email não encontrada. Entre em contato com o administrador.");
    }

    // Configuração do transporter
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const isSecure = process.env.SMTP_SECURE === "true";

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: isSecure, // true para 465, false para outras portas
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        // Configurações específicas para Gmail
        ...(smtpHost.includes("gmail.com") && {
            service: "gmail",
            // Gmail requer autenticação OAuth2 ou App Password
            // Se estiver usando App Password, essas configurações ajudam
            authMethod: "PLAIN",
        }),
        // Adiciona opções para melhor compatibilidade
        tls: {
            // Não rejeita certificados auto-assinados (apenas para desenvolvimento)
            rejectUnauthorized: process.env.NODE_ENV === "production",
            ciphers: "SSLv3",
        },
    });

    // URL base da aplicação
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
        || "http://localhost:3000";

    const resetUrl = `${baseUrl}/pages/resetar-senha?token=${resetToken}`;

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@apae.com",
        to: email,
        subject: "Recuperação de Senha - APAE",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #165BAA;
                        color: white;
                        padding: 20px;
                        text-align: center;
                        border-radius: 8px 8px 0 0;
                    }
                    .content {
                        background-color: #f9f9f9;
                        padding: 30px;
                        border-radius: 0 0 8px 8px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 30px;
                        background-color: #165BAA;
                        color: white;
                        text-decoration: none;
                        border-radius: 42px;
                        margin: 20px 0;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #0b5ed7;
                    }
                    .footer {
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid #ddd;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Recuperação de Senha</h1>
                    </div>
                    <div class="content">
                        <p>Olá${userName ? `, ${userName}` : ""},</p>
                        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
                        <p>Clique no botão abaixo para redefinir sua senha:</p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Redefinir Senha</a>
                        </div>
                        <p>Ou copie e cole o link abaixo no seu navegador:</p>
                        <p style="word-break: break-all; color: #165BAA;">${resetUrl}</p>
                        <p><strong>Este link expira em 1 hora.</strong></p>
                        <p>Se você não solicitou a redefinição de senha, ignore este email.</p>
                    </div>
                    <div class="footer">
                        <p>Este é um email automático, por favor não responda.</p>
                        <p>APAE - Associação de Pais e Amigos dos Excepcionais</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `
            Recuperação de Senha - APAE
            
            Olá${userName ? `, ${userName}` : ""},
            
            Recebemos uma solicitação para redefinir a senha da sua conta.
            
            Clique no link abaixo para redefinir sua senha:
            ${resetUrl}
            
            Este link expira em 1 hora.
            
            Se você não solicitou a redefinição de senha, ignore este email.
            
            Este é um email automático, por favor não responda.
            APAE - Associação de Pais e Amigos dos Excepcionais
        `,
    };

    try {
        console.log("Verificando conexão SMTP com Gmail...");
        // Verifica a conexão antes de enviar
        await transporter.verify();
        console.log("✅ Conexão SMTP verificada com sucesso");

        console.log("Enviando email de recuperação...");
        // Envia o email
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email de recuperação enviado para: ${email}`);
        console.log("Message ID:", info.messageId);
    } catch (error: unknown) {
        const errorObj = error as {
            message?: string;
            code?: string;
            command?: string;
            response?: string;
            responseCode?: number;
        };
        console.error("❌ Erro detalhado ao enviar email de recuperação:", {
            message: errorObj.message,
            code: errorObj.code,
            command: errorObj.command,
            response: errorObj.response,
            responseCode: errorObj.responseCode,
        });

        // Mensagens de erro mais específicas
        if (errorObj.code === "EAUTH") {
            const isGmail = smtpHost.includes("gmail.com");
            const hasBadCredentials = errorObj.response?.includes("BadCredentials") || errorObj.message?.includes("BadCredentials") || errorObj.responseCode === 535;

            if (isGmail && hasBadCredentials) {
                const errorMessage = "Credenciais do Gmail inválidas.\n\n" +
                    "Para usar Gmail, você precisa:\n" +
                    "1. Ativar a verificação em duas etapas na sua conta Google\n" +
                    "   Acesse: https://myaccount.google.com/security\n\n" +
                    "2. Gerar uma 'Senha de app' (App Password)\n" +
                    "   Acesse: https://myaccount.google.com/apppasswords\n" +
                    "   - Selecione 'Mail' e 'Other'\n" +
                    "   - Digite 'APAE Site' como nome\n" +
                    "   - Copie a senha gerada (16 caracteres)\n\n" +
                    "3. Configure no .env.local:\n" +
                    "   SMTP_USER=seu-email@gmail.com\n" +
                    "   SMTP_PASS=xxxx xxxx xxxx xxxx  (use a senha de app gerada, sem espaços)\n\n" +
                    "⚠️ NÃO use sua senha normal do Gmail! Use apenas a Senha de app.";
                throw new Error(errorMessage);
            } else {
                throw new Error("Falha na autenticação SMTP. Verifique as credenciais SMTP_USER e SMTP_PASS.");
            }
        } else if (errorObj.code === "ECONNECTION" || errorObj.code === "ETIMEDOUT") {
            throw new Error("Falha ao conectar com o servidor SMTP. Verifique SMTP_HOST e SMTP_PORT.");
        } else if (errorObj.response) {
            throw new Error(`Erro do servidor SMTP: ${errorObj.response}`);
        } else {
            throw new Error(`Falha ao enviar email: ${errorObj.message || "Erro desconhecido"}`);
        }
    }
}

