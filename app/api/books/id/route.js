// app/api/books/id/route.js
import pool from "@/lib/db";

// Contoh: GET semua buku (hanya untuk demo/test)
export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [books] = await conn.query(
      `SELECT b.*, c.name AS category_name
       FROM books b
       LEFT JOIN book_categories c ON b.category_id = c.id`
    );
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
