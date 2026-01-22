import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/user/route';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

vi.mock('@/lib/prisma', () => ({
	prisma: { user: { findUnique: vi.fn() } }
}));
vi.mock('jsonwebtoken');

describe('User Profile API (GET /api/user)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_SECRET = 'segredo_teste';
	});

	it('deve retornar 401 se o token estiver ausente ou inválido', async () => {
		(jwt.verify as any).mockImplementation(() => { throw new Error() });

		const req = new Request('http://localhost/api/user', {
			method: 'GET',
			headers: { 'Authorization': 'Bearer token_invalido' }
		});

		const res = await GET(req);
		expect(res.status).toBe(401);
		expect((await res.json()).message).toBe("Erro na interno do servidor");
	});

	it('deve retornar os dados do perfil se o token for válido', async () => {
		(jwt.verify as any).mockReturnValue({ userId: '50' });

		const mockUser = {
			id: 50,
			username: 'patricia_apae',
			name: 'Patricia',
			typeUser: 'ADMIN'
		};
		(prisma.user.findUnique as any).mockResolvedValue(mockUser);

		const req = new Request('http://localhost/api/user', {
			method: 'GET',
			headers: { 'Authorization': 'Bearer token_valido' }
		});

		const res = await GET(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.username).toBe('patricia_apae');
		expect(data).not.toHaveProperty('password');

		expect(prisma.user.findUnique).toHaveBeenCalledWith(
			expect.objectContaining({ where: { id: 50 } })
		);
	});

	it('deve retornar 404 se o usuário do token não existir mais no banco', async () => {
		(jwt.verify as any).mockReturnValue({ userId: '99' });
		(prisma.user.findUnique as any).mockResolvedValue(null);

		const req = new Request('http://localhost/api/user', {
			method: 'GET',
			headers: { 'Authorization': 'Bearer token_valido' }
		});

		const res = await GET(req);
		expect(res.status).toBe(404);
		expect((await res.json()).message).toBe("Usuário não encontrado.");
	});
});