"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookDetailPage() {
  const params = useParams(); // ambil id dari URL
  const { id } = params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error("Gagal memuat buku");
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Buku tidak ditemukan</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={book.cover_url || "/default-cover.png"}
          alt={book.title}
          className="w-full md:w-64 h-auto object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-700 mb-1">
            <strong>Penulis:</strong> {book.author}
          </p>
          <p className="text-gray-700 mb-1">
            <strong>Kategori:</strong> {book.category_name || "Tidak ada"}
          </p>
          <p className="text-gray-700 mb-4">
            <strong>ISBN:</strong> {book.isbn || "-"}
          </p>
          <p className="mb-4">
            {book.description || "Deskripsi tidak tersedia."}
          </p>
          <p className="mb-2">
            <strong>Total Stock:</strong> {book.total_stock}
          </p>
          <p className="mb-4">
            <strong>Available Stock:</strong> {book.available_stock}
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            Borrow Request
          </button>
        </div>
      </div>
    </div>
  );
}
