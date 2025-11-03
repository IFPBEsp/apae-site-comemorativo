import { requireAdmin } from "@/app/api/auth/authMiddleware";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await context.params;
		const idNumber = parseInt(id, 10);

		if (isNaN(idNumber)) {
			return NextResponse.json({ message: "ID inválido." }, { status: 400 });
		}

		const date = await prisma.commemorativeDate.findUnique({ where: { id: idNumber } });

		if (!date) {
			return NextResponse.json({ message: "Data não encontrada." }, { status: 404 });
		}
		return NextResponse.json({ data: date }, { status: 200 });
	} catch(error) {
		console.error("Erro ao buscar data:", error);
		return NextResponse.json({ message: "Erro interno." }, { status: 500 });
	}
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		const { id } = await context.params;
		const idNumber = parseInt(id, 10);
		const body = await req.json();
		const { name, date, description } = body;

		if (isNaN(idNumber)) {
			return NextResponse.json({ message: "ID inválido." }, { status: 400 });
		}

		const updatedDate = await prisma.commemorativeDate.update({
			where: { id: idNumber },
			data: { name, description, date: new Date(date) },
		});

		return NextResponse.json(
			{ message: "Data atualizada com sucesso!", data: updatedDate },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erro ao atualizar data:", error);
		return NextResponse.json({ message: "Erro ao atualizar." }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		const { id } = await context.params;
		const idNumber = parseInt(id, 10);

		if (isNaN(idNumber)) {
			return NextResponse.json({ message: "ID inválido." }, { status: 400 });
		}

		await prisma.commemorativeDate.delete({ where: { id: idNumber } });

		return NextResponse.json(
			{ message: "Data deletada com sucesso." },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erro ao deletar data:", error);
		return NextResponse.json({ message: "Erro ao deletar." }, { status: 500 });
	}
}