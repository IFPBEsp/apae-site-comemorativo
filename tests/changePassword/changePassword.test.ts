import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/user/route';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

vi.mock('@/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
		},
	},
}));

vi.mock('jsonwebtoken', () => ({
	default: {
		verify: vi.fn(),
	},
}));

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('User Profile API', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv, JWT_SECRET: 'test_secret' };
	});

	it('deve retornar 401 se o token estiver ausente (Linha 10)', async () => {
		const req = new Request('http://l', { headers: {} });
		const res = await GET(req);
		expect(res.status).toBe(401);
	});

	it('deve lançar erro se JWT_SECRET não estiver configurado (Linha 15)', async () => {
		process.env.JWT_SECRET = "";
		const req = new Request('http://l', { headers: { 'Authorization': 'Bearer t' } });
		await expect(GET(req)).rejects.toThrow("JWT_SECRET não está nas variáveis de ambiente");
	});

	it('deve entrar no catch de verifyToken e retornar 401 (Linha 23)', async () => {
		(jwt.verify as any).mockImplementation(() => { throw new Error('JWT Error'); });
		const req = new Request('http://l', { headers: { 'Authorization': 'Bearer t' } });
		const res = await GET(req);
		expect(res.status).toBe(401);
	});

	it('deve retornar 404 se o usuário não existir no banco (Linha 40)', async () => {
		(jwt.verify as any).mockReturnValue({ userId: '999' });
		(prisma.user.findUnique as any).mockResolvedValue(null);

		const req = new Request('http://l', {
			headers: { 'Authorization': 'Bearer token_valido' }
		});

		const res = await GET(req);
		expect(res.status).toBe(404);
	});

	it('deve retornar 200 com sucesso', async () => {
		(jwt.verify as any).mockReturnValue({ userId: '1' });
		(prisma.user.findUnique as any).mockResolvedValue({ id: 1, username: 'test' });
		const res = await GET(new Request('http://l', { headers: { 'Authorization': 'Bearer t' } }));
		expect(res.status).toBe(200);
	});

	it('deve retornar 500 em erro de banco (Linha 66-67)', async () => {
		(jwt.verify as any).mockReturnValue({ userId: '1' });
		(prisma.user.findUnique as any).mockRejectedValue(new Error('DB Error'));
		const res = await GET(new Request('http://l', { headers: { 'Authorization': 'Bearer t' } }));
		expect(res.status).toBe(500);
	});
});