import { prisma } from "@/lib/prisma";
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


export async function GET(request: Request) {
	const userId = verifyToken(request);
	if (userId === null) {
		return NextResponse.json(
			{ message: "Erro na interno do servidor" },
			{ status: 401 }
		);
	}

	const userIdNumber = parseInt(userId, 10);

	if (!userId) {
		return NextResponse.json(
			{ message: "Não autorizado: Token inválido ou ausente." },
			{ status: 401 }
		);
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: userIdNumber },
			select: {
				id: true,
				username: true,
				name: true,
				typeUser: true
			}
		});

		if (!user) {
			return NextResponse.json(
				{ message: "Usuário não encontrado." },
				{ status: 404 }
			);
		}

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.error("Erro ao buscar dados do perfil:", error);
		return NextResponse.json(
			{ message: "Erro inesperado do servidor ao buscar perfil." },
			{ status: 500 }
		);
	}
}