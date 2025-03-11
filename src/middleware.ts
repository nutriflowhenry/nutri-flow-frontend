// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

console.log("cargando midleware")

export function middleware(request: NextRequest) {

    // Obtener la ruta actual
    const path = request.nextUrl.pathname;

    // Verificar si el usuario está autenticado
    const userJson = request.cookies.get('nutriflowUser')?.value;
    const userSession = userJson? JSON.parse(userJson) : null;
        
    // Rutas protegidas (solo para usuarios no autenticados)
    const publicPaths = ['/login', '/register', '/'];

    // Si el usuario está autenticado y trata de acceder a una ruta pública
    if (userSession && publicPaths.includes(path)) {
        if(userSession.role == "admin"){
            return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        
        //y no es admin redirigir al Home
        } else {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    // Si el usuario con rol 'user' está autenticado y trata de acceder al dashboard admnin
    const adminPath = ['/dashboard/admin'];
    const isAdmin = userSession?.role === "admin";

    if (!isAdmin && adminPath.includes(path)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));      
    }

    // Si el usuario no está autenticado y trata de acceder a una ruta protegida, redirigir al login
    const protectedPaths = ['/dashboard', '/dashboard/admin','/home', '/water-counter','/Physical-form'];
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
       '/dashboard', 
       '/dashboard/admin', 
       '/home', 
       '/loggin',
       '/water-counter',
       '/Physical-form',
    ],
};