import pool from "@/lib/db";

export async function POST() {
  const conn = await pool.getConnection();
  try {
    // Ambil semua peminjaman aktif yang sudah lewat borrow_end
    const [overdueBorrows] = await conn.query(
      `SELECT * FROM borrow_requests
       WHERE status='active' AND borrow_end < NOW()`
    );

    for (const borrow of overdueBorrows) {
      const fine_amount = 5000; // contoh denda tetap, bisa dikembangkan per hari

      // Update status jadi overdue dan simpan denda
      await conn.query(
        `UPDATE borrow_requests
         SET status='overdue', fine_amount=?
         WHERE id=?`,
        [fine_amount, borrow.id]
      );

      // Insert transaksi denda
      await conn.query(
        `INSERT INTO transactions (borrow_request_id, user_id, amount, type, created_at)
         VALUES (?, ?, ?, 'fine', NOW())`,
        [borrow.id, borrow.user_id, fine_amount]
      );
    }

    return new Response(
      JSON.stringify({
        message: "Overdue check completed",
        total: overdueBorrows.length,
      }),
      { status: 200 }
    );
  } finally {
    conn.release();
  }
}
