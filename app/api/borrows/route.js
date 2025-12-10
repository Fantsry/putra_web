import pool from "@/lib/db";

// Create a borrow entry
export async function POST(req) {
  const { user_id, book_id, days = 7 } = await req.json();

  if (!user_id || !book_id) {
    return new Response(JSON.stringify({ error: "user_id and book_id are required" }), { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    // Check book availability
    const [books] = await conn.query("SELECT id, available FROM books WHERE id=?", [book_id]);
    if (!books[0]) {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }
    if (books[0].available <= 0) {
      return new Response(JSON.stringify({ error: "Book is not available" }), { status: 409 });
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + Number(days));

    // Insert borrow
    const [result] = await conn.query(
      `INSERT INTO borrows (user_id, book_id, borrow_date, due_date, status)
       VALUES (?, ?, ?, ?, 'borrowed')`,
      [user_id, book_id, borrowDate, dueDate]
    );

    // Decrease available stock
    await conn.query(`UPDATE books SET available = available - 1 WHERE id=?`, [book_id]);

    return new Response(
      JSON.stringify({ message: "Borrow created", borrowId: result.insertId }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
