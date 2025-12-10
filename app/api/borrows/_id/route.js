import pool from "@/lib/db";

export async function GET(_req, { params }) {
  const { id } = params || {};
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT br.*, b.title, b.author, b.image
       FROM borrows br
       JOIN books b ON br.book_id = b.id
       WHERE br.user_id = ?
       ORDER BY br.borrow_date DESC`,
      [id]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } finally {
    conn.release();
  }
}
