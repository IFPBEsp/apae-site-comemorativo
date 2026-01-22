import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/changePassword/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 1. Mocks das dependências externas
vi.mock('@/lib/prisma', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			update: vi.fn()
		}
	}
}));
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth: Change Password Route', () => {

	beforeEach(() => {
		vi.clearAllMocks();
		process.env.JWT_SECRET = 'segredo_de_teste';
	});

	it('deve retornar 401 se o token JWT for inválido ou estiver ausente', async () => {
		// Simula que o jwt.verify falhou (token mal formatado ou expirado)
		(jwt.verify as any).mockImplementation(() => { throw new Error('Invalid token') });

		const req = new Request('http://localhost/api/changePassword', {
			method: 'POST',
			headers: { 'Authorization': 'Bearer token_invalido' },
			body: JSON.stringify({ currentPassword: '123', newPassword: '456' }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(401);
		expect(data.message).toBe("Não autorizado");
	});

	it('deve retornar 403 se a senha atual informada estiver incorreta', async () => {
		// 1. Simula token válido para o usuário ID 1
		(jwt.verify as any).mockReturnValue({ userId: '1' });

		// 2. Simula que o usuário existe no banco
		(prisma.user.findUnique as any).mockResolvedValue({
			id: 1,
			password: 'hash_da_senha_antiga'
		});

		// 3. Simula que o bcrypt comparou e as senhas NÃO batem
		(bcrypt.compare as any).mockResolvedValue(false);

		const req = new Request('http://localhost/api/changePassword', {
			method: 'POST',
			headers: { 'Authorization': 'Bearer token_valido' },
			body: JSON.stringify({ currentPassword: 'senha_errada', newPassword: 'nova' }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(403);
		expect(data.message).toBe("Senha atual incorreta.");
	});

	it('deve atualizar a senha com sucesso quando os dados e o token são válidos', async () => {
		// Setup de sucesso
		(jwt.verify as any).mockReturnValue({ userId: '1' });
		(prisma.user.findUnique as any).mockResolvedValue({ id: 1, password: 'hash_antigo' });
		(bcrypt.compare as any).mockResolvedValue(true);
		(bcrypt.hash as any).mockResolvedValue('novo_hash_criptografado');

		const req = new Request('http://localhost/api/changePassword', {
			method: 'POST',
			headers: { 'Authorization': 'Bearer token_valido' },
			body: JSON.stringify({
				currentPassword: 'senha_atual_correta',
				newPassword: 'senha_muito_segura'
			}),
		});

		const res = await POST(req);
		const data = await res.json();

		// Validações
		expect(res.status).toBe(200);
		expect(data.message).toBe("Senha atualizada com sucesso.");

		// Verifica se o Prisma foi chamado para atualizar com o novo HASH
		expect(prisma.user.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: { password: 'novo_hash_criptografado' }
		});
	});

});