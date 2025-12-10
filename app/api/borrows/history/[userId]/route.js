import pool from "@/lib/db";

export async function GET(_req, { params }) {
  const { userId } = params || {};
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT br.*, b.title, b.author, b.image,
              CASE
                  WHEN br.status='late' THEN 'red'
                  WHEN br.status='borrowed' THEN 'yellow'
                  WHEN br.status='returned' THEN 'green'
                  ELSE 'gray'
              END AS status_color
       FROM borrows br
       JOIN books b ON br.book_id = b.id
       WHERE br.user_id=?
       ORDER BY br.borrow_date DESC`,
      [userId]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } finally {
    conn.release();
  }
}
