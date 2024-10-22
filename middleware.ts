import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Obtém o cookie com a chave de API
  const apiKey = req.cookies.get('apiKey');

  // Verifica se a rota é /contato ou /
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/contato')) {
    // Se a chave de API não existir, redireciona para a página de login
    if (!apiKey) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Permite continuar para outras rotas
  return NextResponse.next();
}

// Configura quais rotas devem passar pelo middleware
export const config = {
  matcher: ['/', '/contato/:path*'], // Bloqueia a rota inicial e qualquer sub-rota de /contato
};
