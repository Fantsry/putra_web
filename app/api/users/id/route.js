import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { hashPassword } from "@/lib/auth";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET current user profile
export async function GET(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
      [token.id]
    );
    if (!rows[0]) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}

// PUT update profile (name/password)
export async function PUT(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { name, password } = await req.json();
  if (!name && !password) {
    return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    if (password) {
      const hashed = await hashPassword(password);
      await conn.query(`UPDATE users SET name=?, password=? WHERE id=?`, [name || token.name, hashed, token.id]);
    } else {
      await conn.query(`UPDATE users SET name=? WHERE id=?`, [name, token.id]);
    }

    return new Response(JSON.stringify({ message: "Profile updated" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
