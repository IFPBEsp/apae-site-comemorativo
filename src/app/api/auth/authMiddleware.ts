import { NextRequest, NextResponse } from 'next/server';
import { TypeUser } from '@prisma/client';

const getMockUserSession = async (req: NextRequest): Promise<{ isAuthenticated: boolean; typeUser: TypeUser }> => {
    // Para testar, use o header: Authorization: Bearer ADMIN_TOKEN_VAL_ID
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (token === 'ADMIN_TOKEN_VAL_ID') {
        return { isAuthenticated: true, typeUser: TypeUser.ADMIN };
    }
    return { isAuthenticated: false, typeUser: TypeUser.EMPLOYEE };
};

/**
 * Middleware para proteger rotas de modificação, exigindo que o usuário seja ADMIN.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
    const session = await getMockUserSession(req);

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