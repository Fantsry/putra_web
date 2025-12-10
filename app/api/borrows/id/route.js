import pool from "@/lib/db";

// GET single borrow with book & user info
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Borrow ID is required" }), { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT b.id, b.user_id, b.book_id, b.borrow_date, b.due_date, b.return_date, b.status,
              u.name AS user_name, u.email, bk.title, bk.author, bk.image
       FROM borrows b
       JOIN users u ON b.user_id = u.id
       JOIN books bk ON b.book_id = bk.id
       WHERE b.id = ?`,
      [id]
    );
    if (!rows[0]) return new Response(JSON.stringify({ error: "Borrow not found" }), { status: 404 });
    return new Response(JSON.stringify(rows[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}

// PUT mark return (and late detection)
export async function PUT(req) {
  const { id } = await req.json();
  if (!id) {
    return new Response(JSON.stringify({ error: "Borrow ID is required" }), { status: 400 });
  }

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT b.*, bk.id as bk_id FROM borrows b JOIN books bk ON b.book_id = bk.id WHERE b.id=?`,
      [id]
    );
    if (!rows[0]) return new Response(JSON.stringify({ error: "Borrow not found" }), { status: 404 });
    const borrow = rows[0];

    const now = new Date();
    const late = borrow.due_date && now > borrow.due_date;

    await conn.query(
      `UPDATE borrows SET status=?, return_date=? WHERE id=?`,
      [late ? "late" : "returned", now, id]
    );

    // restore availability
    await conn.query(`UPDATE books SET available = available + 1 WHERE id=?`, [borrow.bk_id]);

    // create fine if late
    if (late) {
      await conn.query(
        `INSERT INTO fines (borrow_id, fine_amount, reason, paid)
         VALUES (?, ?, 'late', FALSE)
         ON DUPLICATE KEY UPDATE fine_amount = fine_amount`,
        [id, 0]
      );
    }

    return new Response(JSON.stringify({ message: "Return recorded", late }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
