import pool from "@/lib/db";

// GET all books
export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [books] = await conn.query(
      `SELECT id, title, author, isbn, image, stock, available, created_at, updated_at
       FROM books
       ORDER BY created_at DESC`
    );
    
    // Pastikan response selalu JSON dengan header yang benar
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch books" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } finally {
    conn.release();
  }
}
