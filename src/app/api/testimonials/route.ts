import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";

// ----------------------------------------------------------------------
// Rota de CRIAÇÃO (Create)
// POST /api/testimonials
/**
 * Create a new testimonial (admin only) from the request body.
 *
 * Validates the `name` (minimum 3 characters) and `content` (minimum 10 characters), uses the provided `date` or the current date, persists the testimonial as published, and returns the created record.
 *
 * @returns JSON response:
 * - 201: success message and the created testimonial object
 * - 400: validation error message when `name` or `content` is invalid
 * - 500: server error message on unexpected failure
 * - the authentication response returned by the admin check when the requester is not authorized
 */
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

		let submissionDate = date ? new Date(date) : new Date();

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
/**
 * Retrieves a paginated list of published testimonials from the database.
 *
 * Parses `page` and `limit` from the request query string (defaults: page=1, limit=10),
 * returns testimonials ordered by date descending and pagination metadata.
 *
 * @param req - Incoming request which may include `page` and `limit` query parameters
 * @returns A JSON response containing `data` (array of testimonials with `id`, `name`, `content`, and `date`) and `meta` (`totalItems`, `totalPages`, `currentPage`, `itemsPerPage`); on server error returns a JSON error message
 */
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