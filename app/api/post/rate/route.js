import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { middleware } from "@/utils/middleware";
import { NextResponse } from "next/server";

// Método POST - Avaliar uma postagem com estrelas (1 a 5)
export async function POST(req) {
  return middleware(req, async () => {
    const { postId, stars } = await req.json();
    await connectMongo();

    if (stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'A avaliação deve ser entre 1 e 5 estrelas' }, { status: 400 });
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
      }

      const userId = req.user.userId;
      const existingRating = post.ratings.find(rating => rating.user.toString() === userId);

      if (existingRating) {
        // Atualizar a avaliação existente
        existingRating.stars = stars;
      } else {
        // Adicionar uma nova avaliação
        post.ratings.push({ user: userId, stars });
      }

      // Calcular a nova média de avaliações
      const totalRatings = post.ratings.length;
      const sumRatings = post.ratings.reduce((acc, rating) => acc + rating.stars, 0);
      post.averageRating = sumRatings / totalRatings;

      await post.save();
      return NextResponse.json(post);
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao avaliar postagem' }, { status: 500 });
    }
  });
}
