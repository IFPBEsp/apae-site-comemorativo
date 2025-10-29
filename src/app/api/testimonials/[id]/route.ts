import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";

interface Params {
  id: string;
}

// ---------------- GET ----------------
export async function GET(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: { id: true, name: true, content: true },
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

// ---------------- PUT ----------------
export async function PUT(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    const body = await req.json();
    const { name, content, isPublished } = body;

    if (content !== undefined && content.trim().length < 10)
      return NextResponse.json(
        { message: "O 'content' deve ter no mínimo 10 caracteres." },
        { status: 400 }
      );

    if (name !== undefined && name.trim().length < 3)
      return NextResponse.json(
        { message: "O 'name' deve ter no mínimo 3 caracteres." },
        { status: 400 }
      );

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { name, content, isPublished },
      select: { id: true, name: true, content: true },
    });

    return NextResponse.json(
      { message: "Depoimento atualizado com sucesso!", data: updatedTestimonial },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "P2025")
      return NextResponse.json({ message: "Depoimento não encontrado." }, { status: 404 });

    console.error("Erro ao atualizar depoimento:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor ao atualizar depoimento." },
      { status: 500 }
    );
  }
}

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  const authResponse = await requireAdmin(req);
  if (authResponse) return authResponse;

  try {
    await prisma.testimonial.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "P2025")
      return NextResponse.json(
        { message: "Depoimento não encontrado para exclusão." },
        { status: 404 }
      );

    console.error("Erro ao deletar depoimento:", error);
    return NextResponse.json(
      { message: "Erro interno do servidor ao deletar depoimento." },
      { status: 500 }
    );
  }
}
