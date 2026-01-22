import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('@/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
	},
}));

vi.mock('bcrypt', () => ({
	default: {
		compare: vi.fn(),
	},
}));

vi.mock('jsonwebtoken', () => ({
	default: {
		sign: vi.fn(),
	},
}));

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Auth Login API', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv, JWT_SECRET: 'test_secret' };
	});

	it('deve retornar 400 se faltarem campos obrigatórios', async () => {
		const req = new Request('http://l', {
			method: 'POST',
			body: JSON.stringify({ username: 'user' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(400);
	});

	it('deve retornar 401 se o usuário não for encontrado (Linha 25-29)', async () => {
		(prisma.user.findUnique as any).mockResolvedValue(null);

		const req = new Request('http://l', {
			method: 'POST',
			body: JSON.stringify({ username: 'inexistente', password: '123' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).message).toBe('Credenciais inválidas');
	});

	it('deve retornar 401 se a senha estiver incorreta (Linha 36-40)', async () => {
		(prisma.user.findUnique as any).mockResolvedValue({ id: 1, username: 'admin', password: 'hash' });
		(bcrypt.compare as any).mockResolvedValue(false);

		const req = new Request('http://l', {
			method: 'POST',
			body: JSON.stringify({ username: 'admin', password: 'wrong_password' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(401);
	});

	it('deve retornar 500 se o JWT_SECRET não estiver definido (Linha 47-49)', async () => {
		delete process.env.JWT_SECRET;
		(prisma.user.findUnique as any).mockResolvedValue({ id: 1, username: 'admin', password: 'hash' });
		(bcrypt.compare as any).mockResolvedValue(true);

		const req = new Request('http://l', {
			method: 'POST',
			body: JSON.stringify({ username: 'admin', password: '123' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(500);
	});

	it('deve fazer login com sucesso e retornar um token (200)', async () => {
		const mockUser = { id: 1, username: 'admin', password: 'hash', typeUser: 'ADMIN' };
		(prisma.user.findUnique as any).mockResolvedValue(mockUser);
		(bcrypt.compare as any).mockResolvedValue(true);
		(jwt.sign as any).mockReturnValue('token_gerado');

		const req = new Request('http://l', {
			method: 'POST',
			body: JSON.stringify({ username: 'admin', password: '123' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({ token: 'token_gerado' });
	});

	it('deve retornar 500 em caso de erro inesperado no banco (Linha 61-62)', async () => {
		(prisma.user.findUnique as any).mockRejectedValue(new Error('Banco offline'));

		const req = new Request('http://l', {
			method: 'POST',
			body: JSON.stringify({ username: 'admin', password: '123' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(500);
		expect((await res.json()).message).toBe('erro inesperado do servidor');
	});
});