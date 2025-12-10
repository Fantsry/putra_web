import pool from "@/lib/db";

export async function GET(req) {
  const { userId } = req.params;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT br.*, b.title, b.cover_url,
              CASE
                  WHEN br.status='overdue' THEN 'red'
                  WHEN br.status='active' THEN 'yellow'
                  WHEN br.status='completed' THEN 'green'
                  ELSE 'gray'
              END AS status_color
       FROM borrow_requests br
       JOIN books b ON br.book_id = b.id
       WHERE br.user_id=?`,
      [userId]
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } finally {
    conn.release();
  }
}
