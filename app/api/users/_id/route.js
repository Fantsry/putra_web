// app/api/users/[id]/route.js
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { promises as fs } from "fs";
import path from "path";
import formidable from "formidable";
import bcrypt from "bcrypt";

export const config = {
  api: {
    bodyParser: false, // Formidable akan handle parsing
  },
};

const SECRET = process.env.NEXTAUTH_SECRET;

// GET user by id
export async function GET(req, { params }) {
  const { id } = params;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, name, email, nipd, role_id, profile_photo, created_at
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
  const { id } = params;
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
      const hash = await bcrypt.hash(password, 10);
      await conn.query(`UPDATE users SET name=?, password_hash=? WHERE id=?`, [
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

// POST upload profile photo
export async function POST(req, { params }) {
  const { id } = params;
  const token = await getToken({ req, secret: SECRET });

  if (!token || (token.id !== parseInt(id) && token.role !== "admin")) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const form = formidable({
    multiples: false,
    uploadDir: path.join(process.cwd(), "public/uploads/profile"),
    keepExtensions: true,
  });

  return new Promise((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        resolve(
          new Response(JSON.stringify({ error: err.message }), { status: 500 })
        );
        return;
      }

      if (!files.photo) {
        resolve(
          new Response(JSON.stringify({ error: "No file uploaded" }), {
            status: 400,
          })
        );
        return;
      }

      const file = files.photo;
      const relativePath = `/uploads/profile/${path.basename(file.filepath)}`;

      const conn = await pool.getConnection();
      try {
        await conn.query(`UPDATE users SET profile_photo=? WHERE id=?`, [
          relativePath,
          id,
        ]);
        resolve(
          new Response(
            JSON.stringify({
              message: "Profile photo updated",
              url: relativePath,
            }),
            { status: 200 }
          )
        );
      } catch (error) {
        resolve(
          new Response(JSON.stringify({ error: error.message }), {
            status: 500,
          })
        );
      } finally {
        conn.release();
      }
    });
  });
}
