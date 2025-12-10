// app/api/borrows/id/route.js
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // ambil query param ?id=123

  if (!id) {
    return new Response(JSON.stringify({ error: "Borrow ID is required" }), {
      status: 400,
    });
  }

  const token = await getToken({ req, secret: SECRET });
  if (!token)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT br.*, b.title, b.cover_url, u.name AS user_name
       FROM borrow_requests br
       JOIN books b ON br.book_id = b.id
       JOIN users u ON br.user_id = u.id
       WHERE br.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return new Response(JSON.stringify({ error: "Borrow not found" }), {
        status: 404,
      });

    const borrow = rows[0];

    // Jika user bukan admin/guru, cek apakah dia pemilik
    if (
      token.role !== "admin" &&
      token.role !== "guru" &&
      borrow.user_id !== token.id
    ) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
      });
    }

    return new Response(JSON.stringify(borrow), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    conn.release();
  }
}

// Contoh POST untuk update status (approve/reject/picked-up/complete)
export async function POST(req) {
  const { id, action } = await req.json();

  if (!id || !action) {
    return new Response(
      JSON.stringify({ error: "ID and action are required" }),
      { status: 400 }
    );
  }

  const token = await getToken({ req, secret: SECRET });
  if (!token)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM borrow_requests WHERE id = ?`,
      [id]
    );
    if (rows.length === 0)
      return new Response(JSON.stringify({ error: "Borrow not found" }), {
        status: 404,
      });

    const borrow = rows[0];

    // Action logic sesuai role
    if (action === "approve" || action === "reject") {
      if (token.role !== "guru")
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });

      const status = action === "approve" ? "approved" : "rejected";
      await conn.query(
        `UPDATE borrow_requests SET status = ?, approved_by = ?, approved_at = NOW() WHERE id = ?`,
        [status, token.id, id]
      );
    } else if (action === "picked-up") {
      if (token.id !== borrow.user_id)
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });

      await conn.query(
        `UPDATE borrow_requests 
         SET status = 'active', borrow_start = NOW(), borrow_end = DATE_ADD(NOW(), INTERVAL 7 DAY)
         WHERE id = ?`,
        [id]
      );

      // Kurangi available_stock
      await conn.query(
        `UPDATE books SET available_stock = available_stock - 1 WHERE id = ?`,
        [borrow.book_id]
      );
    } else if (action === "complete") {
      if (
        token.role !== "admin" &&
        token.role !== "guru" &&
        token.id !== borrow.user_id
      ) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
        });
      }

      await conn.query(
        `UPDATE borrow_requests SET status = 'completed' WHERE id = ?`,
        [id]
      );

      // Tambah available_stock
      await conn.query(
        `UPDATE books SET available_stock = available_stock + 1 WHERE id = ?`,
        [borrow.book_id]
      );
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({ message: `Action ${action} executed successfully` }),
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
