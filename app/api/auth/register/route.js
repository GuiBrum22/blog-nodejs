import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, email, password } = await request.json();
  await connectMongo();
  
  try {
    const user = new User({ username, email, password });
    await user.save();
    return NextResponse.json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar usuário' }, { status: 400 });
  }
}
