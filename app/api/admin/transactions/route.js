import pool from "@/lib/db";

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT t.*, u.name AS user_name, b.title AS book_title
       FROM transactions t
       JOIN users u ON t.user_id = u.id
       JOIN borrow_requests br ON t.borrow_request_id = br.id
       JOIN books b ON br.book_id = b.id
       ORDER BY t.created_at DESC`
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } finally {
    conn.release();
  }
}
