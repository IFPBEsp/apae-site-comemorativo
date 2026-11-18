import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/user/route";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

vi.mock("@/lib/prisma", () => ({
	prisma: {
		user: { findUnique: vi.fn() },
	},
}));

vi.mock("jsonwebtoken", () => ({
	default: { verify: vi.fn() },
}));

vi.spyOn(console, "error").mockImplementation(() => {});

describe("User Profile API - Final Coverage", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		vi.clearAllMocks();
		process.env = { ...originalEnv, JWT_SECRET: "test_secret" };
	});

	it("deve retornar 401 se o token estiver ausente (Linha 10)", async () => {
		const res = await GET(new Request("http://l"));
		expect(res.status).toBe(401);
	});

	it("deve lançar erro se JWT_SECRET ausente (Linha 15)", async () => {
		process.env.JWT_SECRET = "";
		await expect(GET(new Request("http://l", { headers: { "Authorization": "Bearer t" } }))).rejects.toThrow();
	});

	it("deve retornar 401 se o token for inválido/expirado (Linha 23)", async () => {
		vi.mocked(jwt.verify as (token: string, secret: jwt.Secret) => jwt.JwtPayload).mockImplementation(() => { throw new Error(); });
		const res = await GET(new Request("http://l", { headers: { "Authorization": "Bearer t" } }));
		expect(res.status).toBe(401);
	});

	it("deve retornar 404 se o usuário não existir no banco (Linha 40)", async () => {
		vi.mocked(jwt.verify as (token: string, secret: jwt.Secret) => jwt.JwtPayload).mockReturnValue({ userId: "999" });
		vi.mocked(prisma.user.findUnique, { partial: true }).mockResolvedValue(null);

		const res = await GET(new Request("http://l", { headers: { "Authorization": "Bearer t" } }));
		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({ message: "Usuário não encontrado." });
	});

	it("deve retornar 200 com sucesso", async () => {
		vi.mocked(jwt.verify as (token: string, secret: jwt.Secret) => jwt.JwtPayload).mockReturnValue({ userId: "1" });
		vi.mocked(prisma.user.findUnique, { partial: true }).mockResolvedValue({ id: 1, username: "test" });
		const res = await GET(new Request("http://l", { headers: { "Authorization": "Bearer t" } }));
		expect(res.status).toBe(200);
	});

	it("deve retornar 500 em erro de banco (Linhas 66-67)", async () => {
		vi.mocked(jwt.verify as (token: string, secret: jwt.Secret) => jwt.JwtPayload).mockReturnValue({ userId: "1" });
		vi.mocked(prisma.user.findUnique, { partial: true }).mockRejectedValue(new Error());
		const res = await GET(new Request("http://l", { headers: { "Authorization": "Bearer t" } }));
		expect(res.status).toBe(500);
	});
});