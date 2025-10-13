import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();

	const { username, password } = body;

	if (!username || !password) {
		return NextResponse.json(
			{ message: "Usuário e senha são obrigatórios" },
			{ status: 400 }
		);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "Usuário inválido" },
				{ status: 400 }
			);
		}

		const isPasswordValid = await bcrypt.compare(
			password,
			user.password
		);

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: "Senha inválida" },
				{ status: 401 }
			);
		}

		const secret = process.env.JWT_SECRET;

		if (!secret) {
			throw new Error("JWT_SECRET não está nas variáveis de ambiente");
		}

		const payload = {
			userId: user.id,
			username: user.username,
			typeUser: user.typeUser,
		};

		const token = jwt.sign(payload, secret, { expiresIn: "1d" });

		return NextResponse.json(
			{ token: token },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erro de login", error);
		return NextResponse.json(
			{ message: "erro inesperado do servidor" },
			{ status: 500 }
		);
	}
}