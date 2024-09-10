import { jwtMiddleware } from '@/utils/middleware';
import { getTodos, addTodo, updateTodo, deleteTodo } from '@/controllers/TodoController';

export async function GET(req, res) {
    return jwtMiddleware(async (req, res) => await getTodos(req, res))(req, res);
}

export async function POST(req, res) {
    return jwtMiddleware(async (req, res) => await addTodo(req, res))(req, res);
}

export async function PUT(req, res) {
    return jwtMiddleware(async (req, res) => await updateTodo(req, res))(req, res);
}

export async function DELETE(req, res) {
    return jwtMiddleware(async (req, res) => await deleteTodo(req, res))(req, res);
}
