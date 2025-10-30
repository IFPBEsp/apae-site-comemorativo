import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";

// ----------------------------------------------------------------------
// Rota de CRIAÇÃO (Create)
// POST /api/testimonials
// ----------------------------------------------------------------------
export async function POST(req: NextRequest) {
	const authResponse = await requireAdmin(req);
	if (authResponse) {
		return authResponse;
	}

	try {
		const body = await req.json();
		const { name, content, date } = body;

		if (!name || name.trim().length < 3) {
			return NextResponse.json(
				{
					message:
						"O campo 'name' é obrigatório e deve ter no mínimo 3 caracteres.",
				},
				{ status: 400 }
			);
		}
		if (!content || content.trim().length < 10) {
			return NextResponse.json(
				{
					message:
						"O campo 'content' é obrigatório e deve ter no mínimo 10 caracteres.",
				},
				{ status: 400 }
			);
		}

		const submissionDate = date ? new Date(date) : new Date();

		const newTestimonial = await prisma.testimonial.create({
			data: {
				name,
				content,
				date: submissionDate,
				isPublished: true, // Admins criam, então já publicamos
			},
		});

		return NextResponse.json(
			{ message: "Depoimento cadastrado com sucesso!", data: newTestimonial },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Erro ao criar depoimento:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao processar a requisição." },
			{ status: 500 }
		);
	}
}

// ----------------------------------------------------------------------
// Rota de LEITURA (Read All)
// GET /api/testimonials?page=1&limit=10
// ----------------------------------------------------------------------
export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url);
		const page = parseInt(url.searchParams.get("page") || "1");
		const limit = parseInt(url.searchParams.get("limit") || "10");

		const skip = (page - 1) * limit;

		const [testimonials, totalCount] = await prisma.$transaction([
			prisma.testimonial.findMany({
				where: {
					isPublished: true,
				},
				select: {
					id: true,
					name: true,
					content: true,
					date: true,
				},
				orderBy: {
					date: "desc",
				},
				skip: skip,
				take: limit,
			}),
			prisma.testimonial.count({
				where: {
					isPublished: true,
				},
			}),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return NextResponse.json(
			{
				data: testimonials,
				meta: {
					totalItems: totalCount,
					totalPages: totalPages,
					currentPage: page,
					itemsPerPage: limit,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Erro ao listar depoimentos:", error);
		return NextResponse.json(
			{ message: "Erro interno do servidor ao listar depoimentos." },
			{ status: 500 }
		);
	}
}
