import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Parseia o JSON do corpo da requisição
    const { username, email, password } = await request.json();

    // Valida se os campos estão presentes
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' }, 
        { status: 400 }
      );
    }

    // Conecta ao MongoDB
    await connectMongo();

    // Cria um novo usuário e salva no banco de dados
    const user = new User({ username, email, password });
    await user.save();

    // Retorna uma resposta de sucesso
    return NextResponse.json({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { error: 'Erro ao registrar usuário' }, 
      { status: 500 }
    );
  }
}
