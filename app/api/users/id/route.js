// app/api/users/id/route.js
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET user login (atau specific user fixed id)
export async function GET(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, name, email, nipd, role_id, profile_photo, created_at
       FROM users
       WHERE id = ?`,
      [token.id] // pakai token.id supaya otomatis user login
    );
    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}

// PUT update profile user login
export async function PUT(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const data = await req.json();
  const { name, password } = data;

  const conn = await pool.getConnection();
  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await conn.query(`UPDATE users SET name=?, password_hash=? WHERE id=?`, [
        name,
        hash,
        token.id,
      ]);
    } else {
      await conn.query(`UPDATE users SET name=? WHERE id=?`, [name, token.id]);
    }

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
