"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/books");
      const json = await res.json();
      setBooks(json);
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Hapus buku ini?")) return;

    await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    setBooks((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard/admin"
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            ← Kembali ke Dashboard Admin
          </Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Kelola Buku</h1>
        <Link
          href="/dashboard/admin/books/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Tambah Buku
        </Link>
      </div>

      <table className="w-full border rounded-lg bg-white">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3">Cover</th>
            <th className="p-3">Judul</th>
            <th className="p-3">Penulis</th>
            <th className="p-3">Stok</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {books.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="p-3">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="h-14 rounded object-cover" />
                ) : (
                  <div className="h-14 w-10 bg-gray-200 rounded flex items-center justify-center">📚</div>
                )}
              </td>
              <td className="p-3">{b.title}</td>
              <td className="p-3">{b.author}</td>
              <td className="p-3">
                {b.available || 0} / {b.stock || 0}
              </td>
              <td className="p-3 flex gap-3">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(b.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
