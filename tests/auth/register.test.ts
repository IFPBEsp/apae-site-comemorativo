import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { POST } from '@/app/api/auth/register/route';
import { headers } from 'next/headers';

vi.mock('next/headers', () => ({
	headers: vi.fn(),
}));

vi.mock('jsonwebtoken', () => ({
	default: {
		verify: vi.fn(),
	},
}));

vi.mock('@/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
		},
	},
}));

vi.mock('bcrypt', () => ({
	default: {
		hash: vi.fn().mockResolvedValue('hash123_seguro'),
	},
}));

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Auth Register API - Cobertura Total', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv, JWT_SECRET: 'test-secret-key' };

		(headers as any).mockResolvedValue({
			get: vi.fn().mockReturnValue('Bearer token-valido'),
		});

		(jwt.verify as any).mockReturnValue({ typeUser: 'ADMIN', userId: 1 });
	});

	it('deve retornar 401 se o header de autorização estiver ausente (Linha 22)', async () => {
		(headers as any).mockResolvedValue({
			get: vi.fn().mockReturnValue(null),
		});

		const req = new NextRequest('http://l', { method: 'POST' });
		const res = await POST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).message).toContain('Token de autorização ausente');
	});

	it('deve retornar 500 se o JWT_SECRET não estiver definido (Linha 38-39)', async () => {
		delete process.env.JWT_SECRET;

		const req = new NextRequest('http://l', { method: 'POST' });
		const res = await POST(req);
		expect(res.status).toBe(500);
	});

	it('deve retornar 401 se o token for inválido (Linha 31)', async () => {
		(jwt.verify as any).mockImplementation(() => {
			throw new Error('JWT Error');
		});

		const req = new NextRequest('http://l', { method: 'POST' });
		const res = await POST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).message).toBe('Token inválido ou expirado');
	});

	it('deve retornar 403 se o usuário não for ADMIN', async () => {
		(jwt.verify as any).mockReturnValue({ typeUser: 'USER' });

		const req = new NextRequest('http://l', { method: 'POST' });
		const res = await POST(req);
		expect(res.status).toBe(403);
	});

	it('deve retornar 400 se faltarem campos obrigatórios', async () => {
		const req = new NextRequest('http://l', {
			method: 'POST',
			body: JSON.stringify({ name: 'Incompleto' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(400);
	});

	it('deve retornar 409 se o usuário já existir', async () => {
		(prisma.user.findUnique as any).mockResolvedValue({ id: 1 });

		const req = new NextRequest('http://l', {
			method: 'POST',
			body: JSON.stringify({
				name: 'a', username: 'existente', password: '123', typeUser: 'USER'
			}),
		});

		const res = await POST(req);
		expect(res.status).toBe(409);
	});

	it('deve criar usuário com sucesso (201)', async () => {
		(prisma.user.findUnique as any).mockResolvedValue(null);
		(prisma.user.create as any).mockResolvedValue({
			id: 1, name: 'OK', username: 'novo', typeUser: 'USER', password: 'hash'
		});

		const req = new NextRequest('http://l', {
			method: 'POST',
			body: JSON.stringify({
				name: 'OK', username: 'novo', password: '123', typeUser: 'USER'
			}),
		});

		const res = await POST(req);
		expect(res.status).toBe(201);
	});
});