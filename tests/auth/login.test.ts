import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('@/lib/prisma', () => ({
	prisma: { user: { findUnique: vi.fn() } }
}));
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth: Login Route', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_SECRET = 'segredo_de_teste';
	});

	it('deve retornar 400 se username ou password não forem enviados', async () => {
		const req = new Request('http://localhost/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username: 'so_o_usuario' }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(400);
		expect(data.message).toBe("Usuário e senha são obrigatórios");
	});

	it('deve retornar 401 se o usuário não for encontrado', async () => {
		(prisma.user.findUnique as any).mockResolvedValue(null);

		const req = new Request('http://localhost/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username: 'inexistente', password: '123' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(401);
		expect((await res.json()).message).toBe("Credenciais inválidas");
	});

	it('deve retornar 200 e um token JWT válido em caso de sucesso', async () => {
		const mockUser = {
			id: 1,
			username: 'patricia',
			password: 'hashed_password_no_banco',
			typeUser: 'ADMIN'
		};
		(prisma.user.findUnique as any).mockResolvedValue(mockUser);

		(bcrypt.compare as any).mockResolvedValue(true);

		(jwt.sign as any).mockReturnValue('token_fake_123');

		const req = new Request('http://localhost/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ username: 'patricia', password: 'senha_correta' }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.token).toBe('token_fake_123');

		expect(jwt.sign).toHaveBeenCalledWith(
			expect.objectContaining({ userId: 1, username: 'patricia' }),
			'segredo_de_teste',
			{ expiresIn: "1d" }
		);
	});
});