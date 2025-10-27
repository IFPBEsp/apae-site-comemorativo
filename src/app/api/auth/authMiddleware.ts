import { NextRequest, NextResponse } from 'next/server';
import { TypeUser } from '@prisma/client';
import jwt from 'jsonwebtoken';

/**
 * Interface para o payload (o conteúdo) do seu JWT.
 * Pegue esta interface do seu 'register' ou defina-a aqui.
 */
interface UserJwtPayload {
    userId: number;
    username: string;
    typeUser: TypeUser; // 'ADMIN', 'EMPLOYEE', 'USER' etc.
    iat: number;
    exp: number;
}

/**
 * Pega a sessão do usuário verificando o JWT com 'jsonwebtoken'.
 */
const getSession = async (req: NextRequest): Promise<{ isAuthenticated: boolean; typeUser: TypeUser | null }> => {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return { isAuthenticated: false, typeUser: null };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET não definido nas variáveis de ambiente");
        return { isAuthenticated: false, typeUser: null };
    }

    try {
        const decoded = jwt.verify(token, secret) as UserJwtPayload;

        return { isAuthenticated: true, typeUser: decoded.typeUser };

    } catch (error) {
        console.warn("Falha na verificação do JWT com 'jsonwebtoken':", (error as Error).message);
        return { isAuthenticated: false, typeUser: null };
    }
};

/**
 * Middleware para proteger rotas, exigindo que o usuário seja ADMIN ou EMPLOYEE.
 */
export async function requireAdminOrEmployee(req: NextRequest): Promise<NextResponse | null> {
    const session = await getSession(req);
    if (!session.isAuthenticated) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized", message: "Autenticação requerida." }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (session.typeUser !== TypeUser.ADMIN && session.typeUser !== TypeUser.EMPLOYEE) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden", message: "Acesso negado. Requer privilégios de Administrador ou Funcionário." }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }
    return null;
}

/**
 * Middleware para proteger rotas, exigindo que o usuário seja ADMIN.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
    const session = await getSession(req);

    if (!session.isAuthenticated) {
        return new NextResponse(
          JSON.stringify({ error: "Unauthorized", message: "Autenticação requerida." }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    if (session.typeUser !== TypeUser.ADMIN) {
        return new NextResponse(
          JSON.stringify({ error: "Forbidden", message: "Acesso negado. Apenas administradores podem modificar." }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return null;
}