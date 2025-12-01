import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/bcrypt";
import { createToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, username, password } = await req.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      username,
      password: hashed,
    });

    // OPTIONAL: Auto-login after signup
    const token = await createToken({
      id: user._id,
      role: user.role,
    });

    const res = NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
