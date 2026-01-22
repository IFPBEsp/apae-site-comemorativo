import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PUT, DELETE } from '@/app/api/TimelinePost/[id]/route';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/app/api/auth/authMiddleware';
import * as fs from 'fs/promises';

vi.mock('@/lib/prisma', () => ({
	prisma: {
		timelinePost: {
			findUnique: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}));

vi.mock('@/app/api/auth/authMiddleware', () => ({
	requireAdmin: vi.fn(),
}));

vi.mock('fs/promises', () => ({
	unlink: vi.fn().mockResolvedValue(undefined),
	mkdir: vi.fn().mockResolvedValue(undefined),
	writeFile: vi.fn().mockResolvedValue(undefined),
}));

vi.spyOn(console, 'error').mockImplementation(() => {});

describe('TimelinePost [id] - Final Force', () => {

	const mockParams = { params: Promise.resolve({ id: '123' }) };

	beforeEach(() => {
		vi.resetAllMocks();
		(requireAdmin as any).mockResolvedValue(null);
	});

	it('deve retornar 500 no GET (Linha 60-63)', async () => {
		vi.mocked(prisma.timelinePost.findUnique).mockRejectedValueOnce(new Error('DB Fail'));
		const res = await GET(new Request('http://l') as any, mockParams);
		expect(res.status).toBe(500);
	});

	it('deve retornar 404 no PUT ao falhar busca de imagem (Linha 118)', async () => {
		const formData = new FormData();
		formData.append('title', 'Titulo Valido');
		formData.append('description', 'Descricao longa o suficiente');
		formData.append('image', new File(['content'], 'test.png', { type: 'image/png' }));

		const req = {
			formData: async () => formData,
			method: 'PUT'
		} as any;

		vi.mocked(prisma.timelinePost.findUnique).mockResolvedValue(null);

		const res = await PUT(req, mockParams);
		expect(res.status).toBe(404);
	});

	it('deve entrar no catch P2025 do PUT (Linhas 163-164)', async () => {
		const formData = new FormData();
		formData.append('title', 'Titulo Valido');
		formData.append('description', 'Descricao longa');

		vi.mocked(prisma.timelinePost.findUnique).mockResolvedValue({ id: '123' } as any);
		const errorP2025 = { code: 'P2025' };
		vi.mocked(prisma.timelinePost.update).mockRejectedValueOnce(errorP2025);

		const res = await PUT({ formData: async () => formData } as any, mockParams);
		expect(res.status).toBe(404);
	});

	it('deve lidar com erro ENOENT ao deletar arquivo (Linha 23)', async () => {
		vi.mocked(prisma.timelinePost.findUnique).mockResolvedValue({ id: '123', imageUrl: '/uploads/img.png' } as any);
		vi.mocked(prisma.timelinePost.delete).mockResolvedValue({} as any);
		vi.mocked(fs.unlink).mockRejectedValueOnce({ code: 'ENOENT' });

		const res = await DELETE(new Request("http://l") as any, mockParams);
		expect(res.status).toBe(204);
	});

	it('deve retornar 404 no DELETE (Linhas 211-212)', async () => {
		vi.mocked(prisma.timelinePost.findUnique).mockResolvedValueOnce({ id: '123' } as any);
		const errorP2025 = { code: 'P2025' };
		vi.mocked(prisma.timelinePost.delete).mockRejectedValueOnce(errorP2025);

		const res = await DELETE(new Request('http://l') as any, mockParams);
		expect(res.status).toBe(404);
	});

	it('deve deletar post com sucesso (Caminho Feliz - Linhas 15-23)', async () => {
		vi.mocked(prisma.timelinePost.findUnique).mockResolvedValue({ id: '123', imageUrl: '/uploads/old.png' } as any);
		vi.mocked(prisma.timelinePost.delete).mockResolvedValue({ id: '123' } as any);
		vi.mocked(fs.unlink).mockResolvedValue(undefined);

		const res = await DELETE(new Request("http://l") as any, mockParams);
		expect(res.status).toBe(204);
	});
});