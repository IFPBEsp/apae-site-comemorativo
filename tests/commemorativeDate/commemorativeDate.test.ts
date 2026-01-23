import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/commemorativeDate/route';
import { prisma } from '@/lib/prisma';
import { requireAdminOrEmployee } from '@/app/api/auth/authMiddleware';

vi.mock('@/app/api/auth/authMiddleware', () => ({
	requireAdminOrEmployee: vi.fn(),
	requireAdmin: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
	prisma: {
		commemorativeDate: {
			create: vi.fn(),
			findMany: vi.fn(),
		},
	},
}));

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Commemorative Date API - Unificada', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(requireAdminOrEmployee as any).mockResolvedValue(null);
	});

	describe('Método POST', () => {
		it('deve retornar 401 se não estiver autorizado', async () => {
			(requireAdminOrEmployee as any).mockResolvedValue(
				new Response(JSON.stringify({ message: 'Acesso Negado' }), { status: 401 })
			);

			const req = new NextRequest('http://l', { method: 'POST' });
			const res = await POST(req);
			expect(res.status).toBe(401);
		});

		it('deve validar nome curto (Linha 16)', async () => {
			const req = new NextRequest('http://l', {
				method: 'POST',
				body: JSON.stringify({ name: 'Ab', description: 'Descrição longa o suficiente', date: '2025-01-01' }),
			});
			const res = await POST(req);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toContain('mínimo 3 caracteres');
		});

		it('deve validar descrição curta (Linha 24)', async () => {
			const req = new NextRequest('http://l', {
				method: 'POST',
				body: JSON.stringify({ name: 'Natal', description: 'Curta', date: '2025-01-01' }),
			});
			const res = await POST(req);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toContain('mínimo 10 caracteres');
		});

		it('deve validar data ausente (Linha 32)', async () => {
			const req = new NextRequest('http://l', {
				method: 'POST',
				body: JSON.stringify({ name: 'Natal', description: 'Descrição longa o suficiente' }),
			});
			const res = await POST(req);
			expect(res.status).toBe(400);
			expect((await res.json()).message).toBe("O campo 'Data' é obrigatório.");
		});

		it('deve criar com sucesso (201)', async () => {
			(prisma.commemorativeDate.create as any).mockResolvedValue({ id: 1, name: 'Natal' });
			const req = new NextRequest('http://l', {
				method: 'POST',
				body: JSON.stringify({ name: 'Natal', description: 'Descrição longa o suficiente', date: '2025-12-25' }),
			});
			const res = await POST(req);
			expect(res.status).toBe(201);
		});

		it('deve tratar erro 500 no POST (Linha 55-56)', async () => {
			(prisma.commemorativeDate.create as any).mockRejectedValue(new Error('DB Fail'));
			const req = new NextRequest('http://l', {
				method: 'POST',
				body: JSON.stringify({ name: 'Natal', description: 'Descrição longa o suficiente', date: '2025-12-25' }),
			});
			const res = await POST(req);
			expect(res.status).toBe(500);
		});
	});

	describe('Método GET', () => {
		it('deve listar datas com sucesso (200)', async () => {
			(prisma.commemorativeDate.findMany as any).mockResolvedValue([{ id: 1, name: 'Natal' }]);
			const res = await GET();
			expect(res.status).toBe(200);
			const data = await res.json();
			expect(data).toBeInstanceOf(Array);
		});

		it('deve tratar erro 500 no GET', async () => {
			(prisma.commemorativeDate.findMany as any).mockRejectedValue(new Error('DB Fail'));
			const res = await GET();
			expect(res.status).toBe(500);
		});
	});
});