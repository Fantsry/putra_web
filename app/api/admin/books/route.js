import pool from "@/lib/db";

// Route untuk GET semua buku (admin) & POST tambah buku baru
export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [books] = await conn.query(
      `SELECT b.*, c.name AS category_name
       FROM books b
       LEFT JOIN book_categories c ON b.category_id = c.id`
    );
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}

export async function POST(req) {
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

  if (!title || !author || !total_stock) {
    return new Response(
      JSON.stringify({ error: "Title, author, and total_stock are required" }),
      { status: 400 }
    );
  }

  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO books
        (title, author, isbn, category_id, description, cover_url, total_stock, available_stock, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        title,
        author,
        isbn || null,
        category_id || null,
        description || null,
        cover_url || null,
        total_stock,
        total_stock,
      ]
    );
    return new Response(
      JSON.stringify({
        message: "Book created successfully",
        bookId: result.insertId,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}
