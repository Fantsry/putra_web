import pool from "@/lib/db";

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [[bookCounts]] = await conn.query(`SELECT COUNT(*) AS total_books FROM books`);
    const [[userCounts]] = await conn.query(
      `SELECT 
         SUM(CASE WHEN role='admin' THEN 1 ELSE 0 END) AS admins,
         SUM(CASE WHEN role='member' THEN 1 ELSE 0 END) AS members
       FROM users`
    );
    const [[borrowCounts]] = await conn.query(
      `SELECT 
         SUM(CASE WHEN status='borrowed' THEN 1 ELSE 0 END) AS borrowed,
         SUM(CASE WHEN status='returned' THEN 1 ELSE 0 END) AS returned,
         SUM(CASE WHEN status='late' THEN 1 ELSE 0 END) AS late
       FROM borrows`
    );
    const [[fineTotals]] = await conn.query(
      `SELECT 
         SUM(CASE WHEN paid=FALSE THEN fine_amount ELSE 0 END) AS unpaid_fines,
         SUM(fine_amount) AS total_fines
       FROM fines`
    );

    return new Response(
      JSON.stringify({
        books: bookCounts.total_books,
        users: userCounts,
        borrows: borrowCounts,
        fines: fineTotals,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    conn.release();
  }
}
