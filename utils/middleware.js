import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Middleware para verificar JWT
export function jwtMiddleware(req) {
  // Obter o token do header Authorization (Formato: "Bearer <token>")
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Token não fornecido ou formato incorreto' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica o token e extrai o payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adiciona o payload decodificado ao req.user (ou contexto de sessão)
    req.user = decoded; // Pode ser necessário ajustar dependendo do seu uso
    return NextResponse.next(); // Continua para o próximo middleware ou controlador
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: 'Token expirado' }, { status: 403 });
    } else if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Token inválido' }, { status: 403 });
    } else {
      return NextResponse.json({ message: 'Erro ao verificar o token' }, { status: 500 });
    }
  }
}
