import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";

// ----------------------------------------------------------------------
// Rota de BUSCA POR ID (Read One)
// GET /api/testimonials/{id}
// ----------------------------------------------------------------------
// O {params} recebe os parâmetros dinâmicos da URL, neste caso o 'id'
export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	try {
		const testimonial = await prisma.testimonial.findUnique({
			where: {
				id: id,
				isPublished: true, // Apenas busca depoimentos publicados
			},
			select: {
				id: true,
				name: true,
				content: true,
				date: true,
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
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	// 1. Proteger a rota com autenticação (Critério de Aceitação)
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse; // Retorna 401 ou 403 se falhar
	}

	try {
		const body = await req.json();
		const { name, content, isPublished, date } = body;

		// 2. Validação básica de dados (Critério de Aceitação)
		// O PUT geralmente espera o objeto completo, mas faremos uma validação flexível.
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

		// 3. Atualizar o Depoimento
		const updatedTestimonial = await prisma.testimonial.update({
			where: { id: id },
			data: {
				name: name,
				content: content,
				isPublished: isPublished, // Permite ao admin publicar/despublicar
				date: date ? new Date(date) : undefined,
			},
		});

		// Critério: Retorna status HTTP 200 OK
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
			// Erro do Prisma: Record to update not found (Critério: Retorna 404)
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
	{ params }: { params: { id: string } }
) {
	const { id } = params;

	// 1. Proteger a rota com autenticação (Critério de Aceitação)
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse; // Retorna 401 ou 403 se falhar
	}

	try {
		// 2. Deletar o Depoimento
		await prisma.testimonial.delete({
			where: { id: id },
		});

		// Critério: Retorna status HTTP 204 No Content para exclusão bem-sucedida
		return new NextResponse(null, { status: 204 });
	} catch (error: unknown) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			(error as { code?: string }).code === "P2025"
		) {
			// Erro do Prisma: Record to delete not found (Critério: Retorna 404)
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
