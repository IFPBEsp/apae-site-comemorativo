import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function verifyToken(request: Request) {
	const authHeader = request.headers.get("Authorization");
	const token = authHeader?.split(" ")[1];

	if (!token) {
		return null;
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		throw new Error("JWT_SECRET não está nas variáveis de ambiente");
	}

	try {
		const decoded = jwt.verify(token, secret) as { userId: string };
		return decoded.userId;
	} catch (error) {
		console.error("Token verification failed:", error);
		return null;
	}
}

export async function POST(request: Request) {
	const body = await request.json();
	const { currentPassword, newPassword } = body;

	const userId = verifyToken(request);
	if (!userId) {
		return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
	}

	try {
		const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });

		if (!user) {
			return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
		}

		const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

		if (!isPasswordValid) {
			return NextResponse.json({ message: "Senha atual incorreta." }, { status: 403 });
		}

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

		await prisma.user.update({
			where: { id: parseInt(userId) },
			data: { password: hashedPassword },
		});

		return NextResponse.json({ message: "Senha atualizada com sucesso." }, { status: 200 });

	} catch (error) {
		console.error("Erro na troca de senha:", error);
		return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
	}
}