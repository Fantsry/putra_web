// app/dashboard/admin/actions.js
"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

const checkAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin")
    throw new Error("Akses ditolak");
  return session;
};

// Tambah Buku
export async function addBook(formData) {
  await checkAdmin();
  const title = formData.get("title");
  const author = formData.get("author");
  const isbn = formData.get("isbn");
  const category = formData.get("category");
  const total_stock = parseInt(formData.get("total_stock")) || 1;

  await pool.query(
    `INSERT INTO books (title, author, isbn, category_id, total_stock, available_stock) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, author, isbn || null, category || 1, total_stock, total_stock]
  );
  revalidatePath("/dashboard/admin/books");
}

// Tambah Guru
export async function addTeacher(formData) {
  await checkAdmin();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id) 
     VALUES (?, ?, ?, (SELECT id FROM roles WHERE name = 'guru'))`,
    [name, email, hash]
  );
  revalidatePath("/dashboard/admin/teachers");
}
