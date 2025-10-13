import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

	const body = await request.json();
	const { name, username, password, typeUser } = body;

	if (!name || !username || !password || !typeUser) {
		return NextResponse.json(
			{ message: "Todos os campos são obrigatórios" },
			{ status: 400 }
		);
	}

	try {
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