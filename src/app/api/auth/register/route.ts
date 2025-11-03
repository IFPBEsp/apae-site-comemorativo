/* eslint-disable @typescript-eslint/no-unused-vars */
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
	const { name, username, password, typeUser } = body;

	if (!name || !username || !password || !typeUser) {
		return NextResponse.json(
			{ message: "Todos os campos são obrigatórios" },
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

	const hashedPassword = await bcrypt.hash(password, 12);
	const user = await prisma.user.create({
		data: {
			name: name,
			username: username,
			password: hashedPassword,
			typeUser: typeUser
		},
	});

	const { password: _, ...userWithoutPassword } = user;

	return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
	} catch (error) {
		console.error("Erro ao registrar usuário: ", error);
		return NextResponse.json(
			{ message: "erro inesperado do servidor" },
			{ status: 500 }
		);
	}
}