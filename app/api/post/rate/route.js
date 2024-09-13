import Post from "@/models/Post";
import Rating from "@/models/Rating"; // Import do modelo de Avaliação (Rating)
import connectMongo from "@/utils/dbConnect";
import { middleware } from "@/utils/middleware"; // Ajuste o caminho conforme necessário
import { NextResponse } from "next/server";

// Função auxiliar para aplicar o middleware e retornar uma resposta
async function applyMiddleware(req, handler) {
  const res = {
    status: (statusCode) => ({ json: (data) => NextResponse.json(data, { status: statusCode }) }),
    json: (data) => NextResponse.json(data),
  };
  return new Promise((resolve) => {
    middleware(req, res, () => {
      handler(req).then(resolve);
    });
  });
}

// Método POST - Avaliar uma postagem com estrelas (1 a 5)
export async function POST(req) {
  return applyMiddleware(req, async () => {
    await connectMongo(); // Conectar ao banco de dados MongoDB

    try {
      const { postId, stars } = await req.json();
      await connectMongo();
    
      if (stars < 1 || stars > 5) {
        return NextResponse.json(
          { error: 'A avaliação deve ser entre 1 e 5 estrelas' },
          { status: 400 }
        );
      }
    
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json(
          { error: 'Postagem não encontrada' },
          { status: 404 }
        );
      }
    
      const rating = new Rating({
        post: postId,
        user: req.user.id,  // Adapte conforme necessário
        stars
      });
    
      await rating.save();
      return NextResponse.json(rating);
    } catch (error) {
      console.error('Erro ao processar avaliação:', error);
      return NextResponse.json(
        { error: 'Erro ao processar avaliação', details: error.message },
        { status: 500 }
      );
    }
    
  });
}
