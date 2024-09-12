import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { middleware } from "@/utils/middleware"; // Ajuste o caminho conforme necessário
import { NextResponse } from "next/server";

// Função auxiliar para aplicar o middleware e retornar uma resposta
async function applyMiddleware(req, handler) {
  const res = { status: () => {}, json: () => {} }; // Mock response for middleware
  return new Promise((resolve) => {
    middleware(req, res, () => {
      handler(req).then(resolve);
    });
  });
}

// Método POST - Avaliar uma postagem com estrelas (1 a 5)
export async function POST(req) {
  return applyMiddleware(req, async () => {
    const { postId, stars } = await req.json();
    await connectMongo();

    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'A avaliação deve ser entre 1 e 5 estrelas' },
        { status: 400 }
      );
    }

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Postagem não encontrada' },
          { status: 404 }
        );
      }

      const userId = req.user.id; // Assumindo que o payload do token tem um campo 'id'
      if (!userId) {
        return NextResponse.json(
          { error: 'Usuário não autenticado' },
          { status: 401 }
        );
      }

      const existingRating = post.ratings.find(
        rating => rating.user.toString() === userId
      );

      if (existingRating) {
        existingRating.stars = stars;
      } else {
        post.ratings.push({ user: userId, stars });
      }

      const totalRatings = post.ratings.length;
      const sumRatings = post.ratings.reduce(
        (acc, rating) => acc + rating.stars, 0
      );
      post.averageRating = sumRatings / totalRatings;

      await post.save();
      return NextResponse.json(post);
    } catch (error) {
      console.error('Erro ao avaliar postagem:', error);
      return NextResponse.json(
        { error: 'Erro ao avaliar postagem', details: error.message },
        { status: 500 }
      );
    }
  });
}
