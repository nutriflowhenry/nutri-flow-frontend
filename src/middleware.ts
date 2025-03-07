// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Obtener la ruta actual
    const path = request.nextUrl.pathname;

    // Verificar si el usuario está autenticado
    const userSession = request.cookies.get('token')?.value;

    // Rutas protegidas (solo para usuarios no autenticados)
    const publicPaths = ['/login', '/register', '/'];

    // Si el usuario está autenticado y trata de acceder a una ruta pública, redirigir al dashboard
    if (userSession && publicPaths.includes(path)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Si el usuario no está autenticado y trata de acceder a una ruta protegida, redirigir al login
    const protectedPaths = ['/dashboard', '/home', '/water-counter'];
    if (!userSession && protectedPaths.includes(path)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Permitir el acceso a la ruta solicitada
    return NextResponse.next();
}

// Configuración del middleware
export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/home',
        '/dashboard',
        '/water-counter',
    ],
};