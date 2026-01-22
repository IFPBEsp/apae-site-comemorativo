import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as routeMain from '@/app/api/testimonials/route';
import * as routeId from '@/app/api/testimonials/[id]/route';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/api/auth/authMiddleware';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
	prisma: {
		testimonial: {
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

vi.mock('@/app/api/auth/authMiddleware', () => ({
	requireAdmin: vi.fn(),
}));

describe('Testimonials API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /api/testimonials', () => {
		it('deve listar depoimentos publicados com paginação', async () => {
			const mockData = [{ id: '1', name: 'João', content: 'Muito bom o site!' }];
			(prisma.$transaction as any).mockResolvedValue([mockData, 1]);

			const req = new NextRequest('http://localhost/api/testimonials?page=1&limit=10');
			const res = await routeMain.GET(req);
			const json = await res.json();

			expect(res.status).toBe(200);
			expect(json.data).toHaveLength(1);
			expect(json.meta.totalItems).toBe(1);
		});
	});

	describe('POST /api/testimonials', () => {
		it('deve retornar 403 se não for administrador', async () => {
			(requireAdmin as any).mockResolvedValue(
				new Response(JSON.stringify({ message: 'Acesso negado' }), { status: 403 })
			);

			const req = new NextRequest('http://localhost/api/testimonials', { method: 'POST' });
			const res = await routeMain.POST(req);

			expect(res.status).toBe(403);
		});

		it('deve validar tamanho mínimo do nome e conteúdo', async () => {
			(requireAdmin as any).mockResolvedValue(null);

			const req = new NextRequest('http://localhost/api/testimonials', {
				method: 'POST',
				body: JSON.stringify({ name: 'Jo', content: 'Curto' }),
			});

			const res = await routeMain.POST(req);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toContain('mínimo');
		});

		it('deve criar um depoimento com sucesso se for admin', async () => {
			(requireAdmin as any).mockResolvedValue(null);
			(prisma.testimonial.create as any).mockResolvedValue({ id: '123', name: 'Patricia' });

			const req = new NextRequest('http://localhost/api/testimonials', {
				method: 'POST',
				body: JSON.stringify({
					name: 'Patricia',
					content: 'Conteúdo com mais de dez caracteres',
					role: 'Diretora'
				}),
			});

			const res = await routeMain.POST(req);
			expect(res.status).toBe(201);
			expect(prisma.testimonial.create).toHaveBeenCalled();
		});
	});


	describe('DELETE /api/testimonials/[id]', () => {
		it('deve retornar 404 se o depoimento não existir', async () => {
			(requireAdmin as any).mockResolvedValue(null);
			(prisma.testimonial.delete as any).mockRejectedValue({ code: 'P2025' });

			const req = new NextRequest('http://localhost/api/testimonials/999', { method: 'DELETE' });
			const context = { params: Promise.resolve({ id: '999' }) };

			const res = await routeId.DELETE(req, context);
			expect(res.status).toBe(404);
		});
	});
});