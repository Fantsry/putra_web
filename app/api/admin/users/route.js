import pool from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  const { name, email, password, role = "member" } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Name, email, and password are required" }), { status: 400 });
  }
  if (!["admin", "member"].includes(role)) {
    return new Response(JSON.stringify({ error: "Role must be admin or member" }), { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [exists] = await conn.query("SELECT id FROM users WHERE email=?", [email]);
    if (exists.length) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 409 });
    }

    const hashed = await hashPassword(password);
    const [result] = await conn.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashed, role]
    );

    return new Response(JSON.stringify({ message: "User created", userId: result.insertId }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
