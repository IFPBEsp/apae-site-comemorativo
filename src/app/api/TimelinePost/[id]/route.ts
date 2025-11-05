import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/app/api/auth/authMiddleware";
import * as fs from "fs/promises";
import * as path from "path";

const UPLOAD_BASE_DIR = path.join(process.cwd(), "public");

async function deleteFile(relativePath: string) {
    if (relativePath && relativePath.startsWith("/uploads")) {
        const absolutePath = path.join(UPLOAD_BASE_DIR, relativePath);
        try {
            await fs.unlink(absolutePath);
        } catch (error) {
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                (error as { code: string }).code === "ENOENT"
            ) {
                return;
            }
            console.error(`Erro ao tentar deletar o arquivo ${absolutePath}:`, error);
        }
    }
}

// ----------------------------------------------------------------------
// Rota de BUSCA POR ID (Read One)
// GET /api/timeline-posts/{id}
// ----------------------------------------------------------------------
export async function GET(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    try {
        const post = await prisma.timelinePost.findUnique({
            where: {
                id: id,
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                description: true,
                imageUrl: true,
                postDate: true,
            },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Postagem não encontrada ou não está publicada." },
                { status: 404 }
            );
        }

        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar postagem:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor ao buscar postagem." },
            { status: 500 }
        );
    }
}

// ----------------------------------------------------------------------
// Rota de ATUALIZAÇÃO (Update)
// PUT /api/timeline-posts/{id}
// ----------------------------------------------------------------------
export async function PUT(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    const authResponse = await requireAdmin(req);
    if (authResponse) {
        return authResponse;
    }

    try {
        const formData = await req.formData();
        
        const title = formData.get("title") as string | undefined;
        const description = formData.get("description") as string | undefined;
        const isPublishedValue = formData.get("isPublished");
        const isPublished = isPublishedValue !== undefined ? isPublishedValue === "true" : undefined;

        const postDate = formData.get("postDate") as string | undefined;
        const newImageFile = formData.get("image") as File | null;

        if (title !== undefined && title.trim().length < 5) {
            return NextResponse.json(
                { message: "O 'title' deve ter no mínimo 5 caracteres." },
                { status: 400 }
            );
        }
        if (description !== undefined && description.trim().length < 10) {
            return NextResponse.json(
                { message: "O 'description' deve ter no mínimo 10 caracteres." },
                { status: 400 }
            );
        }

        let imageUrlUpdate: string | undefined;

        if (newImageFile && newImageFile.size > 0) {
            const existingPost = await prisma.timelinePost.findUnique({ where: { id: id } });
            if (!existingPost) {
                return NextResponse.json({ message: "Postagem não encontrada." }, { status: 404 });
            }
        
            const UPLOAD_DIR_POSTS = path.join(UPLOAD_BASE_DIR, "uploads", "timeline-posts");
            await fs.mkdir(UPLOAD_DIR_POSTS, { recursive: true });
            
            const uniqueFileName = `${Date.now()}-${newImageFile.name.replace(/\s/g, "_")}`;
            const filePath = path.join(UPLOAD_DIR_POSTS, uniqueFileName);
            
            const fileBuffer = Buffer.from(await newImageFile.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);
            
            imageUrlUpdate = `/uploads/timeline-posts/${uniqueFileName}`;
        
            if (existingPost.imageUrl) {
                await deleteFile(existingPost.imageUrl);
            }
        }

        const dataToUpdate: Record<string, unknown> = {};
        if (title !== undefined) dataToUpdate.title = title;
        if (description !== undefined) dataToUpdate.description = description;
        if (imageUrlUpdate !== undefined) dataToUpdate.imageUrl = imageUrlUpdate;
        if (isPublished !== undefined) dataToUpdate.isPublished = isPublished;
        if (postDate !== undefined) dataToUpdate.postDate = new Date(postDate);

        const updatedPost = await prisma.timelinePost.update({
            where: { id: id },
            data: dataToUpdate,
        });

        return NextResponse.json(
            { message: "Postagem atualizada com sucesso!", data: updatedPost },
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
                { message: "Postagem não encontrada." },
                { status: 404 }
            );
        }
        console.error("Erro ao atualizar postagem:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor ao atualizar postagem." },
            { status: 500 }
        );
    }
}

// ----------------------------------------------------------------------
// Rota de EXCLUSÃO (Delete) - COM EXCLUSÃO DO ARQUIVO
// DELETE /api/timeline-posts/{id}
// ----------------------------------------------------------------------
export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const { id } = context.params;

    const authResponse = await requireAdmin(req);
    if (authResponse) {
        return authResponse;
    }

    try {
        const post = await prisma.timelinePost.findUnique({
            where: { id: id },
            select: { imageUrl: true },
        });

        if (!post) {
            return NextResponse.json(
                { message: "Postagem não encontrada para exclusão." },
                { status: 404 }
            );
        }

        await prisma.timelinePost.delete({
            where: { id: id },
        });

        await deleteFile(post.imageUrl);

        return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "P2025"
        ) {
            return NextResponse.json(
                { message: "Postagem não encontrada para exclusão." },
                { status: 404 }
            );
        }
        console.error("Erro ao deletar postagem:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor ao deletar postagem." },
            { status: 500 }
        );
    }
}
