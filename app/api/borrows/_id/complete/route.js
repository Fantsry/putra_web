import pool from "@/lib/db";

export async function POST(req) {
  const { id } = req.params;

  const conn = await pool.getConnection();
  try {
    // Set status completed
    const [result] = await conn.query(
      "UPDATE borrow_requests SET status='completed' WHERE id=? AND status='active'",
      [id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Borrow not active or already completed" }),
        { status: 404 }
      );
    }

    // Kembalikan available_stock buku
    await conn.query(
      "UPDATE books b JOIN borrow_requests br ON b.id=br.book_id SET b.available_stock=b.available_stock+1 WHERE br.id=?",
      [id]
    );

    return new Response(
      JSON.stringify({ message: "Borrow completed, book returned" }),
      { status: 200 }
    );
  } finally {
    conn.release();
  }
}
