import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  debug: true, // Habilita logs de depuración
});

export const config = {
  matcher: ['/', '/sign-in', '/sign-up', '/favoritos', '/acerca de'], // Todas las rutas necesarias
};
