import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePassword } from "@/lib/bcrypt";
import { createToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // IMPORTANT: Await the token
    const token = await createToken({
      id: user._id.toString(),
      role: user.role,
    });

    const res = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });

    // Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
