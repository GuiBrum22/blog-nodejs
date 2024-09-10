import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { middleware } from "@/utils/middleware";
import { NextResponse } from "next/server";

// Método GET - listar todas as postagens (não precisa de autenticação)
export async function GET(req) {
  await connectMongo();
  try {
    const posts = await Post.find().populate('author', 'username');
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao carregar postagens' }, { status: 500 });
  }
}

// Método POST - criar uma nova postagem (precisa de autenticação)
export async function POST(req) {
  return middleware (req, async () => {
    const { title, content } = await req.json();
    await connectMongo();

    try {
      const newPost = new Post({
        title,
        content,
        author: req.user.userId, // O userId está no token decodificado pelo middleware
      });
      await newPost.save();
      return NextResponse.json(newPost);
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao criar postagem' }, { status: 500 });
    }
  });
}

// Método DELETE - deletar uma postagem (precisa de autenticação)
export async function DELETE(req) {
  return middleware (req, async () => {
    const { id } = await req.json();
    await connectMongo();

    try {
      const post = await Post.findOneAndDelete({ _id: id, author: req.user.userId });
      if (!post) return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
      return NextResponse.json({ message: 'Postagem deletada com sucesso' });
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao deletar postagem' }, { status: 500 });
    }
  });
}
