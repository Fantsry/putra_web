// app/api/admin/users/route.js
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function POST(req) {
  const token = await getToken({ req, secret: SECRET });

  if (!token || token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const data = await req.json();
  const { name, email, nipd, password, role } = data;

  if (!name || !password || !role) {
    return new Response(
      JSON.stringify({ error: "Name, password, and role are required" }),
      { status: 400 }
    );
  }

  if (role !== "admin" && role !== "guru") {
    return new Response(
      JSON.stringify({ error: "Role must be admin or guru" }),
      { status: 400 }
    );
  }

  // hash password
  const bcrypt = await import("bcryptjs");
  const password_hash = await bcrypt.hash(password, 10);

  const conn = await pool.getConnection();
  try {
    // Ambil role_id dari roles table
    const [roles] = await conn.query(
      "SELECT id FROM roles WHERE name=? LIMIT 1",
      [role]
    );
    if (roles.length === 0) {
      return new Response(JSON.stringify({ error: "Role not found" }), {
        status: 400,
      });
    }
    const role_id = roles[0].id;

    const [result] = await conn.query(
      `INSERT INTO users (name, email, nipd, password_hash, role_id, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [name, email || null, nipd || null, password_hash, role_id]
    );

    return new Response(
      JSON.stringify({
        message: "User created successfully",
        userId: result.insertId,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
