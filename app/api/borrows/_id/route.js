import pool from "@/lib/db";

export async function GET(req) {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT br.*, b.title, b.cover_url
       FROM borrow_requests br
       JOIN books b ON br.book_id = b.id
       WHERE br.user_id = ?`,
      [id]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } finally {
    conn.release();
  }
}
