import { cookies } from "next/headers";
import { verifyToken } from "./auth";
import User from "@/models/User";
import { connectDB } from "./db";

/**
 * Get authenticated user from JWT cookie
 */
export async function getAuthUser() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  // Must Await jose verification
  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) return null;

  const user = await User.findById(decoded.id).select("-password");
  return user;
}

/**
 * Protect API route for logged-in users only
 */
export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Protect Admin routes only
 */
export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    throw new Error("Admin only route");
  }
  return user;
}
