import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route'; // ajuste se o caminho for diferente
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

vi.mock('@/lib/prisma', () => ({
	prisma: { user: { findUnique: vi.fn(), create: vi.fn() } }
}));
vi.mock('jsonwebtoken');
vi.mock('bcrypt');
vi.mock('next/headers', () => ({
	headers: vi.fn()
}));

describe('Auth: Register Route', () => {

	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_SECRET = 'test_secret';
	});

	it('deve retornar 401 se o token de administrador estiver ausente', async () => {
		const { headers } = await import('next/headers');
		(headers as any).mockResolvedValue(new Map());

		const req = new Request('http://localhost/api/auth/register', { method: 'POST' });
		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(401);
		expect(data.message).toContain('Token de autorização ausente');
	});

	it('deve retornar 403 se o usuário logado não for ADMIN', async () => {
		const { headers } = await import('next/headers');
		(headers as any).mockResolvedValue(new Map([['authorization', 'Bearer token_valido']]));

		(jwt.verify as any).mockReturnValue({ typeUser: 'USER' });

		const req = new Request('http://localhost/api/auth/register', { method: 'POST' });
		const res = await POST(req);

		expect(res.status).toBe(403);
		expect((await res.json()).message).toContain('Apenas administradores');
	});

	it('deve registrar um usuário com sucesso quando os dados são válidos', async () => {
		const { headers } = await import('next/headers');
		(headers as any).mockResolvedValue(new Map([['authorization', 'Bearer token_admin']]));
		(jwt.verify as any).mockReturnValue({ typeUser: 'ADMIN' });

		(prisma.user.findUnique as any).mockResolvedValue(null);
		(prisma.user.create as any).mockResolvedValue({
			id: 10,
			name: 'Novo User',
			username: 'newuser',
			typeUser: 'USER',
			password: 'hashed_password'
		});
		(bcrypt.hash as any).mockResolvedValue('hashed_password');

		const req = new Request('http://localhost/api/auth/register', {
			method: 'POST',
			body: JSON.stringify({
				name: 'Novo User',
				username: 'newuser',
				password: '123',
				typeUser: 'USER'
			}),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(201);
		expect(data.user).not.toHaveProperty('password'); // Garante que a senha foi removida do retorno
		expect(prisma.user.create).toHaveBeenCalled();
	});
});