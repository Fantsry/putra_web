// app/api/promotions/route.js
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

// GET semua promosi
export async function GET(req) {
  const conn = await pool.getConnection();
  try {
    const [promotions] = await conn.query(
      `SELECT * FROM promotions ORDER BY start_date DESC`
    );
    return new Response(JSON.stringify(promotions), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}

// POST tambah promosi baru (hanya admin)
export async function POST(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token || token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const data = await req.json();
  const { title, image_url, start_date, end_date, link } = data;

  if (!title || !image_url || !start_date || !end_date) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
    });
  }

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO promotions (title, image_url, start_date, end_date, link)
       VALUES (?, ?, ?, ?, ?)`,
      [title, image_url, start_date, end_date, link || null]
    );
    return new Response(
      JSON.stringify({
        message: "Promotion created",
        promotionId: result.insertId,
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

// PUT update promosi (hanya admin)
export async function PUT(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token || token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const data = await req.json();
  const { id, title, image_url, start_date, end_date, link } = data;

  if (!id)
    return new Response(JSON.stringify({ error: "Promotion ID required" }), {
      status: 400,
    });

  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE promotions
       SET title=?, image_url=?, start_date=?, end_date=?, link=?
       WHERE id=?`,
      [title, image_url, start_date, end_date, link || null, id]
    );
    return new Response(JSON.stringify({ message: "Promotion updated" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}

// DELETE promosi (hanya admin)
export async function DELETE(req) {
  const token = await getToken({ req, secret: SECRET });
  if (!token || token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id)
    return new Response(JSON.stringify({ error: "Promotion ID required" }), {
      status: 400,
    });

  const conn = await pool.getConnection();
  try {
    await conn.query(`DELETE FROM promotions WHERE id=?`, [id]);
    return new Response(JSON.stringify({ message: "Promotion deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
