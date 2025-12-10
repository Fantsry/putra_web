import pool from "@/lib/db";

export async function POST(req) {
  const { id } = req.params;
  const { guru_id } = await req.json(); // siapa guru yang approve

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      "UPDATE borrow_requests SET status='approved', approved_by=?, approved_at=NOW() WHERE id=? AND status='pending'",
      [guru_id, id]
    );
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Request not found or already processed" }),
        { status: 404 }
      );
    }
    return new Response(
      JSON.stringify({ message: "Borrow request approved" }),
      { status: 200 }
    );
  } finally {
    conn.release();
  }
}
