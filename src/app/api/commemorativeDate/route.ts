import { requireAdminOrEmployee } from "@/app/api/auth/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
	const authResponse = await requireAdminOrEmployee(req);

	if (authResponse) {
		return authResponse;
	}

	try {
		const body = await req.json();
		const { name, date, description } = body;

		if (!name || name.trim().length < 3) {
			return NextResponse.json(
				{ message: "O campo 'name' é obrigatório (mín. 3 caracteres)." },
				{ status: 400 }
			);
		}

		if (!description || description.trim().length < 10) {
			return NextResponse.json(
				{ message: "O campo 'description' é obrigatório (mín. 10 caracteres)." },
				{ status: 400 }
			);
		}

		if (!date) {
			return NextResponse.json(
				{ message: "O campo 'date' é obrigatório." },
				{ status: 400 }
			);
		}

		const submissionDate = new Date(date);

		const newCommemorativeDate = await prisma.commemorativeDate.create({
			data: {
				name,
				description,
				date: submissionDate,
			},
		});

		return NextResponse.json(
			{
				message: "Data comemorativa cadastrada com sucesso!",
				data: newCommemorativeDate,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Erro ao criar data comemorativa:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao processar a requisição." },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {

		const dates = await prisma.commemorativeDate.findMany({
			select: {
				id: true,
				name: true,
				date: true,
				description: true,
			},
			orderBy: { date: "asc" },
		});

		return NextResponse.json(dates, { status: 200 });

	} catch (error) {
		console.error("Erro ao listar datas comemorativas:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao listar datas." },
			{ status: 500 }
		);
	}
}