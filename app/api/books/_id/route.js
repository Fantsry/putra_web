import pool from "@/lib/db";

// GET book by id
export async function GET(req) {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    const [books] = await conn.query(
      `SELECT b.*, c.name AS category_name
       FROM books b
       LEFT JOIN book_categories c ON b.category_id = c.id
       WHERE b.id = ?`,
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
export async function PUT(req) {
  const { id } = req.params;
  const data = await req.json();
  const {
    title,
    author,
    isbn,
    category_id,
    description,
    cover_url,
    total_stock,
  } = data;

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `UPDATE books SET title=?, author=?, isbn=?, category_id=?, description=?, cover_url=?, total_stock=? WHERE id=?`,
      [
        title,
        author,
        isbn,
        category_id,
        description,
        cover_url,
        total_stock,
        id,
      ]
    );
    return new Response(JSON.stringify({ message: "Book updated" }), {
      status: 200,
    });
  } finally {
    conn.release();
  }
}

// DELETE book (Admin only)
export async function DELETE(req) {
  const { id } = req.params;
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM books WHERE id=?", [id]);
    return new Response(JSON.stringify({ message: "Book deleted" }), {
      status: 200,
    });
  } finally {
    conn.release();
  }
}
