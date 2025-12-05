import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

interface JwtPayload {
	userId: number;
	username: string;
	typeUser: string;
	iat: number;
	exp: number;
}

export async function POST(request: Request) {
	try {
		const headersList = await headers();
		const authHeader = headersList.get("authorization");

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return NextResponse.json(
				{ message: "Token de autorização ausente ou mal formatado" },
				{ status: 401 }
			);
		}

		const token = authHeader.split(" ")[1];
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error("JWT_SECRET não definido");
		}

		let decoded: JwtPayload;
		try {
			decoded = jwt.verify(token, secret) as JwtPayload;
		} catch (error) {
			console.error("Erro ao verificar token com o secret: ", error);
			return NextResponse.json(
				{ message: "Token inválido ou expirado" },
				{ status: 401 }
			);
		}

		if (decoded.typeUser !== "ADMIN") {
			return NextResponse.json(
				{ message: "Acesso negado. Apenas administradores podem registrar usuários." },
				{ status: 403 }
			);
		}

		const body = await request.json();
		const { name, username, email, password, typeUser } = body;

		if (!name || !username || !password || !typeUser) {
			return NextResponse.json(
				{ message: "Todos os campos são obrigatórios" },
				{ status: 400 }
			);
		}

		// Validação de formato de email se fornecido
		if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json(
				{ message: "Email inválido" },
				{ status: 400 }
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { username },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "Usuário já existe" },
				{ status: 409 }
			);
		}

		// Verifica se o email já está em uso (se fornecido e se a coluna existir)
		let emailExists = false;
		if (email) {
			try {
				const emailLower = email.trim().toLowerCase();
				// Tenta verificar se a coluna email existe
				const existingEmail = await prisma.$queryRaw<Array<{ id: number }>>`
					SELECT id FROM "User" WHERE email = ${emailLower} LIMIT 1
				`;

				if (existingEmail && existingEmail.length > 0) {
					return NextResponse.json(
						{ message: "Email já está em uso" },
						{ status: 409 }
					);
				}
				emailExists = true;
			} catch (error: unknown) {
				// Se a coluna não existir (código 42703), ignora e continua sem email
				const errorObj = error as { code?: string; meta?: { code?: string } };
				if (errorObj?.code === "P2010" || errorObj?.meta?.code === "42703") {
					console.warn("Coluna email não existe ainda. Execute a migration para habilitar suporte a email.");
					emailExists = false;
				} else {
					throw error;
				}
			}
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		// Tenta inserir com email se a coluna existir, senão insere sem email
		let createdUser;
		// Valida e garante que typeUser seja um valor válido do enum
		if (typeUser !== "ADMIN" && typeUser !== "EMPLOYEE") {
			return NextResponse.json(
				{ message: "Tipo de usuário inválido" },
				{ status: 400 }
			);
		}

		// Prepara o cast do enum de forma segura (validação já feita acima)
		// Usa string literal no SQL para fazer o cast do enum
		const typeUserCast = `'${typeUser}'::"TypeUser"`;

		if (email && emailExists) {
			try {
				const emailValue = email.trim().toLowerCase();
				const user = await prisma.$queryRawUnsafe<Array<{
					id: number;
					name: string;
					username: string;
					email: string | null;
					typeUser: string;
				}>>(
					`INSERT INTO "User" (name, username, email, password, "typeUser")
					VALUES ($1, $2, $3, $4, ${typeUserCast})
					RETURNING id, name, username, email, "typeUser"`,
					name, username, emailValue, hashedPassword
				);

				if (!user || user.length === 0) {
					throw new Error("Falha ao criar usuário");
				}
				createdUser = user[0];
			} catch (error: unknown) {
				// Se a coluna não existir, tenta inserir sem email
				const errorObj = error as { code?: string; meta?: { code?: string } };
				if (errorObj?.code === "P2010" || errorObj?.meta?.code === "42703") {
					const user = await prisma.$queryRawUnsafe<Array<{
						id: number;
						name: string;
						username: string;
						typeUser: string;
					}>>(
						`INSERT INTO "User" (name, username, password, "typeUser")
						VALUES ($1, $2, $3, ${typeUserCast})
						RETURNING id, name, username, "typeUser"`,
						name, username, hashedPassword
					);

					if (!user || user.length === 0) {
						throw new Error("Falha ao criar usuário");
					}
					createdUser = { ...user[0], email: null };
				} else {
					throw error;
				}
			}
		} else {
			// Insere sem email
			const user = await prisma.$queryRawUnsafe<Array<{
				id: number;
				name: string;
				username: string;
				typeUser: string;
			}>>(
				`INSERT INTO "User" (name, username, password, "typeUser")
				VALUES ($1, $2, $3, ${typeUserCast})
				RETURNING id, name, username, "typeUser"`,
				name, username, hashedPassword
			);

			if (!user || user.length === 0) {
				throw new Error("Falha ao criar usuário");
			}
			createdUser = { ...user[0], email: null };
		}

		return NextResponse.json({ user: createdUser }, { status: 201 });
	} catch (error) {
		console.error("Erro ao registrar usuário: ", error);
		return NextResponse.json(
			{ message: "erro inesperado do servidor" },
			{ status: 500 }
		);
	}
}