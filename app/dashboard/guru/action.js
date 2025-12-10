// app/dashboard/guru/actions.js
"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function approveBorrowRequest(requestId) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "guru") {
    throw new Error("Unauthorized");
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE borrow_requests 
       SET status = 'approved', approved_by = ?, approved_at = NOW()
       WHERE id = ? AND status = 'pending'`,
      [session.user.id, requestId]
    );

    await connection.commit();
    revalidatePath("/dashboard/guru");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function rejectBorrowRequest(requestId) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "guru") {
    throw new Error("Unauthorized");
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE borrow_requests 
       SET status = 'rejected', approved_by = ?, approved_at = NOW()
       WHERE id = ? AND status = 'pending'`,
      [session.user.id, requestId]
    );

    await connection.commit();
    revalidatePath("/dashboard/guru");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
