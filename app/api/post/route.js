import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Função GET - Listar postagens
export async function GET(req) {
  await connectMongo();

  try {
    const posts = await Post.find()
                            .select('-createdAt') // Exclui o campo `createdAt`
                            .populate('author', 'username');
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Erro ao buscar postagens:", error);
    return NextResponse.json({ error: 'Erro ao buscar postagens' }, { status: 500 });
  }
}

// Função POST - Criar nova(s) postagem(ns)
export async function POST(req) {
  await connectMongo();

  try {
    const contentType = req.headers.get('content-type');
    console.log("Content-Type:", contentType);

    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type deve ser application/json' }, { status: 400 });
    }

    const requestBody = await req.json();
    console.log("Request Body:", requestBody);

    // Extrair o token do cabeçalho Authorization
    const authHeader = req.headers.get('authorization');
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido ou formato incorreto' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token Extracted:", token);

    let userId;

    try {
      // Verifica o token e extrai o payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
      userId = decoded.userId; // Obtém o ID do usuário do token
    } catch (error) {
      console.error("Token Verification Error:", error);

      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expirado' }, { status: 403 });
      } else if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
      } else {
        return NextResponse.json({ error: 'Erro ao verificar o token' }, { status: 500 });
      }
    }

    const posts = Array.isArray(requestBody) ? requestBody : [requestBody];
    const createdPosts = [];

    for (const post of posts) {
      const { title, content } = post;

      if (!title || !content) {
        return NextResponse.json({ error: 'Título e conteúdo são obrigatórios' }, { status: 400 });
      }

      const newPost = new Post({
        title,
        content,
        author: userId, // Usa o ID do usuário autenticado
      });

      await newPost.save();
      createdPosts.push(newPost);
    }

    return NextResponse.json(createdPosts);
  } catch (error) {
    console.error("Erro ao criar postagem:", error);
    return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
  }
}
