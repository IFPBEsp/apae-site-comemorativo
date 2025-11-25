import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";

// ----------------------------------------------------------------------
// Rota de BUSCA POR ID (Read One)
// GET /api/testimonials/{id}
// ----------------------------------------------------------------------
export async function GET(
	req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;

	try {
		const testimonial = await prisma.testimonial.findUnique({
			where: {
				id: id,
				isPublished: true,
			},
			select: {
				id: true,
				name: true,
				content: true,
				date: true,
				role: true,
			},
		});

		if (!testimonial) {
			return NextResponse.json(
				{ message: "Depoimento não encontrado ou não está publicado." },
				{ status: 404 }
			);
		}

		return NextResponse.json(testimonial, { status: 200 });
	} catch (error) {
		console.error("Erro ao buscar depoimento:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao buscar depoimento." },
			{ status: 500 }
		);
	}
}

// ----------------------------------------------------------------------
// Rota de ATUALIZAÇÃO (Update)
// PUT /api/testimonials/{id}
// ----------------------------------------------------------------------
export async function PUT(
	req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;

	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		const body = await req.json();
		const { name, content, isPublished, date, role } = body;

		if (content !== undefined && content.trim().length < 10) {
			return NextResponse.json(
				{ message: "O 'content' deve ter no mínimo 10 caracteres." },
				{ status: 400 }
			);
		}
		if (name !== undefined && name.trim().length < 3) {
			return NextResponse.json(
				{ message: "O 'name' deve ter no mínimo 3 caracteres." },
				{ status: 400 }
			);
		}

		const dataToUpdate: Record<string, unknown> = {};
		if (name !== undefined) dataToUpdate.name = name;
		if (content !== undefined) dataToUpdate.content = content;
		if (role !== undefined) dataToUpdate.role = role; // ✅ ADICIONADO
		if (isPublished !== undefined) dataToUpdate.isPublished = isPublished;
		if (date !== undefined) dataToUpdate.date = new Date(date);

		const updatedTestimonial = await prisma.testimonial.update({
			where: { id: id },
			data: dataToUpdate,
		});

		return NextResponse.json(
			{
				message: "Depoimento atualizado com sucesso!",
				data: updatedTestimonial,
			},
			{ status: 200 }
		);
	} catch (error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: string }).code === "P2025"
		) {
			return NextResponse.json(
				{ message: "Depoimento não encontrado." },
				{ status: 404 }
			);
		}
		console.error("Erro ao atualizar depoimento:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao atualizar depoimento." },
			{ status: 500 }
		);
	}
}

// ----------------------------------------------------------------------
// Rota de EXCLUSÃO (Delete)
// DELETE /api/testimonials/{id}
// ----------------------------------------------------------------------
export async function DELETE(
	req: NextRequest,
	context: { params: Promise<{ id: string }> }
) {
	const { id } = await context.params;

	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		await prisma.testimonial.delete({
			where: { id: id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: string }).code === "P2025"
		) {
			return NextResponse.json(
				{ message: "Depoimento não encontrado para exclusão." },
				{ status: 404 }
			);
		}
		console.error("Erro ao deletar depoimento:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao deletar depoimento." },
			{ status: 500 }
		);
	}
}
