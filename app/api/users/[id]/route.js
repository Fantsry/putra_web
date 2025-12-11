import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET user by id
export async function GET(req, { params }) {
  const { id } = params || {};
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = ?`,
      [id]
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

// PUT update user (name, password)
export async function PUT(req, { params }) {
  const { id } = params || {};
  const token = await getToken({ req, secret: SECRET });

  // hanya admin atau user sendiri bisa update
  if (!token || (token.id !== parseInt(id) && token.role !== "admin")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const data = await req.json();
  const { name, password } = data;
  const conn = await pool.getConnection();

  try {
    if (password) {
      const bcrypt = await import("bcryptjs");
      const hash = await bcrypt.hash(password, 10);
      await conn.query(`UPDATE users SET name=?, password=? WHERE id=?`, [
        name,
        hash,
        id,
      ]);
    } else {
      await conn.query(`UPDATE users SET name=? WHERE id=?`, [name, id]);
    }
    return new Response(
      JSON.stringify({ message: "User updated successfully" }),
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
