import pool from "@/lib/db";

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT br.*, b.title, b.author, b.image, u.name AS user_name, u.email
       FROM borrows br
       JOIN books b ON br.book_id = b.id
       JOIN users u ON br.user_id = u.id
       WHERE br.status = 'borrowed'
       ORDER BY br.borrow_date DESC`
    );
    return new Response(JSON.stringify(rows), { status: 200 });
  } finally {
    conn.release();
  }
}
