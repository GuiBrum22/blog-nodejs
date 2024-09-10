import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { username, password } = await request.json();
    await connectMongo();
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
        return NextResponse.json({ success: false }, { status: 400 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token });
}
