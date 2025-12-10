import pool from "@/lib/db";

export async function POST(req) {
  const data = await req.json();
  const { user_id, book_id } = data;

  if (!user_id || !book_id) {
    return new Response(
      JSON.stringify({ error: "user_id and book_id required" }),
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();
  try {
    // Insert borrow request
    const [result] = await conn.query(
      `INSERT INTO borrow_requests (user_id, book_id, request_date, status)
       VALUES (?, ?, NOW(), 'pending')`,
      [user_id, book_id]
    );
    return new Response(
      JSON.stringify({
        message: "Borrow request created",
        borrow_id: result.insertId,
      }),
      { status: 201 }
    );
  } finally {
    conn.release();
  }
}
