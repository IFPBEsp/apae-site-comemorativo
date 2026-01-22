import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as routeMain from '@/app/api/TimelinePost/route';
import * as routeId from '@/app/api/TimelinePost/[id]/route';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/api/auth/authMiddleware';
import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';

vi.mock('@/lib/prisma', () => ({
	prisma: {
		timelinePost: {
			create: vi.fn(),
			findMany: vi.fn(),
			count: vi.fn(),
			findUnique: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
		$transaction: vi.fn(),
	},
}));

vi.mock('@vercel/blob', () => ({
	put: vi.fn(),
}));

vi.mock('@/app/api/auth/authMiddleware', () => ({
	requireAdmin: vi.fn(),
}));

vi.mock('fs/promises', () => ({
	mkdir: vi.fn(),
	writeFile: vi.fn(),
	unlink: vi.fn(),
}));

describe('TimelinePost API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('POST /api/timeline-posts (Upload)', () => {
		it('deve criar postagem com sucesso enviando FormData e Imagem', async () => {
			(requireAdmin as any).mockResolvedValue(null);
			(put as any).mockResolvedValue({ url: 'https://blob.com/foto.jpg' });
			(prisma.timelinePost.create as any).mockResolvedValue({ id: '1', title: 'História' });

			const formData = new FormData();
			formData.append('title', 'Evento APAE 2026');
			formData.append('description', 'Uma descrição longa o suficiente para passar.');
			formData.append('image', new File(['conteudo'], 'foto.png', { type: 'image/png' }));

			const req = new NextRequest('http://localhost/api/timeline-posts', {
				method: 'POST',
				body: formData,
			});

			const res = await routeMain.POST(req);
			const json = await res.json();

			expect(res.status).toBe(201);
			expect(put).toHaveBeenCalled();
			expect(prisma.timelinePost.create).toHaveBeenCalledWith({
				data: expect.objectContaining({
					imageUrl: 'https://blob.com/foto.jpg',
					title: 'Evento APAE 2026'
				}),
			});
		});

		it('deve retornar 400 se a imagem estiver ausente no FormData', async () => {
			(requireAdmin as any).mockResolvedValue(null);
			const formData = new FormData();
			formData.append('title', 'Titulo Valido');
			formData.append('description', 'Descricao valida para o teste.');

			const req = new NextRequest('http://localhost/api/timeline-posts', {
				method: 'POST',
				body: formData,
			});

			const res = await routeMain.POST(req);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toContain('enviar um arquivo de imagem');
		});
	});

	describe('DELETE /api/timeline-posts/[id]', () => {
		it('deve deletar do banco e tentar remover o arquivo físico', async () => {
			(requireAdmin as any).mockResolvedValue(null);
			(prisma.timelinePost.findUnique as any).mockResolvedValue({
				id: '1',
				imageUrl: '/uploads/timeline-posts/foto.png'
			});

			const req = new NextRequest('http://localhost/api/timeline-posts/1', { method: 'DELETE' });
			const context = { params: Promise.resolve({ id: '1' }) };

			const res = await routeId.DELETE(req, context);

			expect(res.status).toBe(204);
			expect(prisma.timelinePost.delete).toHaveBeenCalledWith({ where: { id: '1' } });
		});
	});
});