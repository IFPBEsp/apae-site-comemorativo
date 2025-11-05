import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";
import * as fs from "fs/promises";
import * as path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "timeline-posts");

// ----------------------------------------------------------------------
// Rota de CRIAÇÃO (Create) - COM UPLOAD DE ARQUIVO (FormData)
// POST /api/timeline-posts
// Requer: title, description, image (enviados via FormData)
// ----------------------------------------------------------------------
export async function POST(req: NextRequest) {
    const authResponse = await requireAdmin(req);
    if (authResponse) {
        return authResponse;
    }

    try {
        const formData = await req.formData();
        
        const title = formData.get("title") as string | null;
        const description = formData.get("description") as string | null;
        const imageFile = formData.get("image") as File | null;
        
        if (!title || title.trim().length < 5) {
            return NextResponse.json(
                { message: "O campo 'title' é obrigatório e deve ter no mínimo 5 caracteres." },
                { status: 400 }
            );
        }
        if (!description || description.trim().length < 10) {
            return NextResponse.json(
                { message: "O campo 'description' é obrigatório e deve ter no mínimo 10 caracteres." },
                { status: 400 }
            );
        }
        if (!imageFile || imageFile.size === 0) {
             return NextResponse.json(
                { message: "É obrigatório enviar um arquivo de imagem com o nome 'image'." },
                { status: 400 }
            );
        }

        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        const uniqueFileName = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;
        const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);

        const relativeImageUrl = `/uploads/timeline-posts/${uniqueFileName}`;
        
        const newPost = await prisma.timelinePost.create({
            data: {
                title,
                description,
                imageUrl: relativeImageUrl,
                isPublished: true,
                postDate: new Date(),
            },
        });

        return NextResponse.json(
            { message: "Postagem e imagem cadastradas com sucesso!", data: newPost },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao processar upload e criar postagem:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor ao processar a requisição de upload." },
            { status: 500 }
        );
    }
}

// ----------------------------------------------------------------------
// Rota de LEITURA (Read All)
// GET /api/timeline-posts?page=1&limit=10
// ----------------------------------------------------------------------
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");

        const skip = (page - 1) * limit;

        const [posts, totalCount] = await prisma.$transaction([
            prisma.timelinePost.findMany({
                where: {
                    isPublished: true,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    imageUrl: true,
                    postDate: true,
                },
                orderBy: {
                    postDate: "desc",
                },
                skip: skip,
                take: limit,
            }),
            prisma.timelinePost.count({
                where: {
                    isPublished: true,
                },
            }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json(
            {
                data: posts,
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
        console.error("Erro ao listar postagens:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor ao listar postagens." },
            { status: 500 }
        );
    }
}
