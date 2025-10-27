import { requireAdmin } from "@/app/api/auth/authMiddleware";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
	params: { id: string };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
	try {
		const id = parseInt(params.id, 10);
		const date = await prisma.commemorativeDate.findUnique({ where: { id } });

		if (!date) {
			return NextResponse.json({ message: "Data não encontrada." }, { status: 404 });
		}
		return NextResponse.json({ data: date }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: "Erro interno." }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		const id = parseInt(params.id, 10);
		const body = await req.json();
		const { name, date, description } = body;

		if (isNaN(id)) {
			return NextResponse.json({ message: "ID inválido." }, { status: 400 });
		}

		const updatedDate = await prisma.commemorativeDate.update({
			where: { id },
			data: { name, description, date: new Date(date) },
		});

		return NextResponse.json(
			{ message: "Data atualizada com sucesso!", data: updatedDate },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: "Erro ao atualizar." }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		const id = parseInt(params.id, 10);
		await prisma.commemorativeDate.delete({
			where: { id },
		});

		return NextResponse.json(
			{ message: "Data deletada com sucesso." },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: "Erro ao deletar." }, { status: 500 });
	}
}