import pool from "@/lib/db";

export async function POST(req) {
  const { id } = req.params;

  const conn = await pool.getConnection();
  try {
    // Update borrow_start, borrow_end, status=active
    // misal durasi default 7 hari
    const [result] = await conn.query(
      `UPDATE borrow_requests
       SET borrow_start=NOW(),
           borrow_end=DATE_ADD(NOW(), INTERVAL 7 DAY),
           status='active'
       WHERE id=? AND status='approved'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Request not approved or already picked up" }),
        { status: 404 }
      );
    }

    // Kurangi available_stock buku
    await conn.query(
      "UPDATE books b JOIN borrow_requests br ON b.id=br.book_id SET b.available_stock=b.available_stock-1 WHERE br.id=?",
      [id]
    );

    return new Response(
      JSON.stringify({ message: "Borrow request activated" }),
      { status: 200 }
    );
  } finally {
    conn.release();
  }
}
