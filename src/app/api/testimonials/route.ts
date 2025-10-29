import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";

// ----------------------------------------------------------------------
// Rota de CRIAÇÃO (Create)
// POST /api/testimonials
// ----------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    const body = await req.json();
    const { name, content } = body;

    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { message: "O campo 'name' é obrigatório e deve ter no mínimo 3 caracteres." },
        { status: 400 }
      );
    }
    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { message: "O campo 'content' é obrigatório e deve ter no mínimo 10 caracteres." },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        content,
        isPublished: true, // Admin cria já publicado
      },
      select: {
        id: true,
        name: true,
        content: true,
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
// GET /api/testimonials
// ----------------------------------------------------------------------
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isPublished: true },
      select: { id: true, name: true, content: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar depoimentos:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor ao listar depoimentos." },
      { status: 500 }
    );
  }
}
