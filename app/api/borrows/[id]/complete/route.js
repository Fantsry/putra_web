import pool from "@/lib/db";

export async function POST(_req, { params }) {
  const { id } = params || {};

  const conn = await pool.getConnection();
  try {
    // Get borrow info first
    const [borrows] = await conn.query(
      "SELECT book_id, status FROM borrows WHERE id=?",
      [id]
    );

    if (borrows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Borrow not found" }),
        { status: 404 }
      );
    }

    const borrow = borrows[0];
    if (borrow.status === 'returned') {
      return new Response(
        JSON.stringify({ error: "Book already returned" }),
        { status: 400 }
      );
    }

    // Update borrow status to returned
    const now = new Date();
    const [result] = await conn.query(
      "UPDATE borrows SET status='returned', return_date=? WHERE id=? AND status='borrowed'",
      [now, id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Borrow not found or already returned" }),
        { status: 404 }
      );
    }

    // Increase available stock
    await conn.query(
      "UPDATE books SET available = available + 1 WHERE id=?",
      [borrow.book_id]
    );

    return new Response(
      JSON.stringify({ message: "Borrow completed, book returned" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
