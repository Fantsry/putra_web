import pool from "@/lib/db";

export async function POST(_req, { params }) {
  const { id } = params || {};

  const conn = await pool.getConnection();
  try {
    // This route is not needed in your schema since borrows are created directly
    // But we'll keep it for compatibility - it can update borrow_date if needed
    const [borrows] = await conn.query(
      "SELECT book_id FROM borrows WHERE id=?",
      [id]
    );

    if (borrows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Borrow not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Borrow is already active" }),
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
