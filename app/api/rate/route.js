import Post from "@/models/Post";
import Rating from "@/models/Rating";
import connectMongo from "@/utils/dbConnect";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongo();

  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type deve ser application/json' }, { status: 400 });
    }

    // Extrair token, postId e estrelas do corpo da requisição
    const { token, postId, stars } = await req.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    let userId;
    try {
      // Verifica o token e extrai o payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Token expirado' }, { status: 403 });
      } else if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Token inválido' }, { status: 403 });
      } else {
        return NextResponse.json({ error: 'Erro ao verificar o token' }, { status: 500 });
      }
    }

    // Verificar se as estrelas estão entre 1 e 5
    if (stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'A avaliação deve ser entre 1 e 5 estrelas' }, { status: 400 });
    }

    // Buscar a postagem pelo postId
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
    }

    // Verificar se o usuário já fez uma avaliação para esta postagem
    const existingRating = await Rating.findOne({ post: post._id, user: userId });
    if (existingRating) {
      return NextResponse.json({ error: 'Você já avaliou esta postagem' }, { status: 400 });
    }

    // Adicionar a nova avaliação ao campo `ratings`
    post.ratings.push({ user: userId, stars });

    // Recalcular a média das avaliações
    const totalRatings = post.ratings.length;
    const sumRatings = post.ratings.reduce((acc, rating) => acc + rating.stars, 0);
    post.averageRating = sumRatings / totalRatings;

    // Salvar a postagem atualizada
    await post.save();

    return NextResponse.json({
      message: "Avaliação adicionada com sucesso",
      postId: post._id,
      averageRating: post.averageRating
    });
  } catch (error) {
    console.error('Erro ao processar avaliação:', error);
    return NextResponse.json({ error: 'Erro ao processar avaliação', details: error.message }, { status: 500 });
  }
}
