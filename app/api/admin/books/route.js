import pool from "@/lib/db";

// GET all books
export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [books] = await conn.query(
      `SELECT id, title, author, isbn, image, stock, available, created_at, updated_at FROM books`
    );
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}

// POST create book
export async function POST(req) {
  const { title, author, isbn, image = null, stock = 0, available } = await req.json();

  if (!title || !author || !isbn) {
    return new Response(JSON.stringify({ error: "Title, author, and ISBN are required" }), { status: 400 });
  }

  const initialAvailable = available ?? stock;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO books (title, author, isbn, image, stock, available)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, isbn, image, stock, initialAvailable]
    );

    return new Response(
      JSON.stringify({ message: "Book created", bookId: result.insertId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
