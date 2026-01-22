import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as routeId from '@/app/api/TimelinePost/[id]/route';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/api/auth/authMiddleware';
import { NextRequest } from 'next/server';
import * as fs from 'fs/promises';

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
	mkdir: vi.fn().mockResolvedValue(undefined),
	writeFile: vi.fn().mockResolvedValue(undefined),
	unlink: vi.fn().mockResolvedValue(undefined),
}));

describe('TimelinePost API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(requireAdmin as any).mockResolvedValue(null);
	});

	describe('ID Route (PUT)', () => {
		const context = { params: Promise.resolve({ id: '123' }) };

		it('deve atualizar com nova imagem e deletar antiga com sucesso', async () => {
			(prisma.timelinePost.findUnique as any).mockResolvedValue({
				id: '123',
				imageUrl: '/uploads/timeline-posts/foto-velha.png'
			});

			(prisma.timelinePost.update as any).mockResolvedValue({ id: '123', title: 'Sucesso' });

			const formData = new FormData();
			formData.append('title', 'Titulo Atualizado');
			formData.append('description', 'Descricao com mais de dez caracteres');
			formData.append('image', new File(['buffer'], 'nova-imagem.png', { type: 'image/png' }));

			const req = new NextRequest('http://localhost/api/timeline-posts/123', {
				method: 'PUT',
				body: formData
			});

			const res = await routeId.PUT(req, context);
			const json = await res.json();

			expect(res.status).toBe(200);
			expect(json.message).toBe("Postagem atualizada com sucesso!");

			expect(fs.mkdir).toHaveBeenCalled();
			expect(fs.writeFile).toHaveBeenCalled();
			expect(fs.unlink).toHaveBeenCalled();
		});

		it('deve retornar 400 se o título for muito curto no PUT', async () => {
			const formData = new FormData();
			formData.append('title', 'abc');

			const req = new NextRequest('http://localhost/api/timeline-posts/123', {
				method: 'PUT',
				body: formData
			});

			const res = await routeId.PUT(req, context);
			expect(res.status).toBe(400);
		});
	});
});