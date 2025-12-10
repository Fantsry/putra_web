import pool from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  const { name, email, password, role = "member" } = await req.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Name, email, and password required" }), { status: 400 });
  }
  if (!["admin", "member"].includes(role)) {
    return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    // check existing email
    const [existing] = await conn.query("SELECT id FROM users WHERE email=?", [email]);
    if (existing.length) {
      return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });
    }

    const hashed = await hashPassword(password);
    const [result] = await conn.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashed, role]
    );

    return new Response(
      JSON.stringify({ message: "User registered", userId: result.insertId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
