"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const res = await fetch("/api/books");
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Failed to fetch books" }));
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message || "Gagal memuat daftar buku");
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Memuat daftar buku...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Daftar Buku</h1>
        
        {books.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Belum ada buku tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-64 bg-gray-200">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">📚</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{b.author}</p>
                  {b.isbn && (
                    <p className="text-xs text-gray-400 mb-2">
                      ISBN: {b.isbn}
                    </p>
                  )}
                  {b.available !== undefined && (
                    <p className="text-xs text-gray-500 mb-3">
                      Tersedia: {b.available} dari {b.stock || 0}
                    </p>
                  )}
                  <Link
                    href={`/books/${b.id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
