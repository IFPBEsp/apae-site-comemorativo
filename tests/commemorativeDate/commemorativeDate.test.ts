import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as routeMain from '@/app/api/commemorativeDate/route';
import * as routeId from '@/app/api/commemorativeDate/[id]/route';
import { prisma } from '@/lib/prisma';
import { requireAdmin, requireAdminOrEmployee } from '@/app/api/auth/authMiddleware';
import { NextRequest } from 'next/server';

vi.mock('@/lib/prisma', () => ({
	prisma: {
		commemorativeDate: {
			create: vi.fn(),
			findMany: vi.fn(),
			findUnique: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}));

vi.mock('@/app/api/auth/authMiddleware', () => ({
	requireAdmin: vi.fn(),
	requireAdminOrEmployee: vi.fn(),
}));

describe('CommemorativeDate API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET /api/commemorativeDate', () => {
		it('deve listar todas as datas ordenadas por data ascendente', async () => {
			const mockDates = [{ id: 1, name: 'Aniversário APAE' }];
			(prisma.commemorativeDate.findMany as any).mockResolvedValue(mockDates);

			const res = await routeMain.GET();
			const json = await res.json();

			expect(res.status).toBe(200);
			expect(json).toHaveLength(1);
			expect(prisma.commemorativeDate.findMany).toHaveBeenCalledWith(
				expect.objectContaining({ orderBy: { date: 'asc' } })
			);
		});
	});

	describe('POST /api/commemorativeDate', () => {
		it('deve permitir criação se o usuário for ADMIN ou EMPLOYEE', async () => {
			(requireAdminOrEmployee as any).mockResolvedValue(null);
			(prisma.commemorativeDate.create as any).mockResolvedValue({ id: 1, name: 'Natal' });

			const req = new NextRequest('http://localhost/api/commemorativeDate', {
				method: 'POST',
				body: JSON.stringify({
					name: 'Natal Solidário',
					description: 'Evento de natal para os alunos da APAE',
					date: '2026-12-25'
				}),
			});

			const res = await routeMain.POST(req);
			expect(res.status).toBe(201);
			expect(prisma.commemorativeDate.create).toHaveBeenCalled();
		});

		it('deve retornar 400 se a data for obrigatória e não for enviada', async () => {
			(requireAdminOrEmployee as any).mockResolvedValue(null);

			const req = new NextRequest('http://localhost/api/commemorativeDate', {
				method: 'POST',
				body: JSON.stringify({ name: 'Festa', description: 'Descrição longa o suficiente' }),
			});

			const res = await routeMain.POST(req);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toBe("O campo 'Data' é obrigatório.");
		});
	});

	describe('Operações por ID', () => {
		const context = { params: Promise.resolve({ id: '1' }) };

		it('deve retornar 400 se o ID não for um número (NaN)', async () => {
			const badContext = { params: Promise.resolve({ id: 'abc' }) };
			const req = new NextRequest('http://localhost/api/commemorativeDate/abc');

			const res = await routeId.GET(req, badContext);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toBe("ID inválido.");
		});

		it('deve barrar PUT se o usuário não for ADMIN', async () => {
			(requireAdmin as any).mockResolvedValue(
				new Response(JSON.stringify({ message: 'Acesso negado' }), { status: 403 })
			);

			const req = new NextRequest('http://localhost/api/commemorativeDate/1', { method: 'PUT' });
			const res = await routeId.PUT(req, context);

			expect(res.status).toBe(403);
		});

		it('deve deletar com sucesso se for ADMIN e ID for válido', async () => {
			(requireAdmin as any).mockResolvedValue(null);
			(prisma.commemorativeDate.delete as any).mockResolvedValue({});

			const req = new NextRequest('http://localhost/api/commemorativeDate/1', { method: 'DELETE' });
			const res = await routeId.DELETE(req, context);

			expect(res.status).toBe(200);
			expect((await res.json()).message).toBe("Data deletada com sucesso.");
		});
	});
});