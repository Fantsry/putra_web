import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  // Cek admin
  const token = await getToken({ req, secret: SECRET });
  if (!token || token.role !== "admin") {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
    });
  }

  const conn = await pool.getConnection();
  try {
    // Total buku
    const [bookCount] = await conn.query(
      `SELECT COUNT(*) AS total_books FROM books`
    );

    // Total user per role
    const [userCounts] = await conn.query(`
      SELECT r.name AS role, COUNT(u.id) AS total
      FROM users u
      JOIN roles r ON u.role_id = r.id
      GROUP BY r.name
    `);

    // Total peminjaman per status
    const [borrowCounts] = await conn.query(`
      SELECT status, COUNT(*) AS total
      FROM borrow_requests
      GROUP BY status
    `);

    // Total transaksi & total denda
    const [transactionStats] = await conn.query(`
      SELECT 
        COUNT(*) AS total_transactions, 
        SUM(CASE WHEN type='fine' THEN amount ELSE 0 END) AS total_fines,
        SUM(CASE WHEN type='payment' THEN amount ELSE 0 END) AS total_payments
      FROM transactions
    `);

    return new Response(
      JSON.stringify({
        books: bookCount[0].total_books,
        users: userCounts.reduce(
          (acc, row) => ({ ...acc, [row.role]: row.total }),
          {}
        ),
        borrows: borrowCounts.reduce(
          (acc, row) => ({ ...acc, [row.status]: row.total }),
          {}
        ),
        transactions: transactionStats[0],
      }),
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
