import pool from "@/lib/db";

// GET book by id
export async function GET(_req, { params }) {
  const { id } = params || {};
  const conn = await pool.getConnection();
  try {
    const [books] = await conn.query(
      `SELECT id, title, author, isbn, image, stock, available, created_at, updated_at
       FROM books
       WHERE id = ?`,
      [id]
    );
    if (books.length === 0) {
      return new Response(JSON.stringify({ error: "Book not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(books[0]), { status: 200 });
  } finally {
    conn.release();
  }
}

// PUT update book (Admin only)
export async function PUT(req, { params }) {
  const { id } = params || {};
  const data = await req.json();
  const {
    title,
    author,
    isbn,
    image,
    stock,
    available,
  } = data;

  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE books SET title=?, author=?, isbn=?, image=?, stock=?, available=? WHERE id=?`,
      [
        title,
        author,
        isbn,
        image || null,
        stock,
        available,
        id,
      ]
    );
    return new Response(JSON.stringify({ message: "Book updated" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}

// DELETE book (Admin only)
export async function DELETE(_req, { params }) {
  const { id } = params || {};
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM books WHERE id=?", [id]);
    return new Response(JSON.stringify({ message: "Book deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
