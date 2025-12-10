import pool from "@/lib/db";

export async function POST(req, { params }) {
  const { id } = params || {};

  const conn = await pool.getConnection();
  try {
    // In your schema, borrows are created directly without approval
    // This route can be used to verify/check borrow status
    const [borrows] = await conn.query(
      "SELECT * FROM borrows WHERE id=?",
      [id]
    );

    if (borrows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Borrow not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Borrow verified", borrow: borrows[0] }),
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
