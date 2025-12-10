"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function BooksPage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then(setBooks)
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Buku</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((b) => (
          <div key={b.id} className="border p-4 rounded shadow">
            <img
              src={b.cover_url || "/placeholder.png"}
              alt={b.title}
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="font-semibold">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.author}</p>
            <p className="text-sm text-gray-400">{b.category_name || "Umum"}</p>
            <Link
              href={`/books/${b.id}`}
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Lihat Detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
