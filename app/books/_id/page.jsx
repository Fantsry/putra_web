"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function BookDetailPage() {
  const params = useParams();
  const { id } = params;
  const { data: session } = useSession();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${id}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Buku tidak ditemukan" }));
          throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError(error.message || "Gagal memuat buku");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchBook();
    }
  }, [id]);

  async function handleBorrow() {
    if (!session) {
      alert("Silakan login terlebih dahulu");
      window.location.href = "/login";
      return;
    }

    setBorrowing(true);
    try {
      const res = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          book_id: id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Request peminjaman berhasil dikirim!");
      } else {
        alert(data.error || "Gagal mengirim request peminjaman");
      }
    } catch (err) {
      console.error("Error borrowing:", err);
      alert("Terjadi kesalahan saat mengirim request");
    } finally {
      setBorrowing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Memuat detail buku...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Buku tidak ditemukan"}
          </p>
          <Link
            href="/books"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali ke Daftar Buku
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 p-8">
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">📚</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>
              <div className="space-y-3 mb-6">
                <p className="text-gray-700">
                  <strong className="text-gray-900">Penulis:</strong> {book.author}
                </p>
                {book.isbn && (
                  <p className="text-gray-700">
                    <strong className="text-gray-900">ISBN:</strong> {book.isbn}
                  </p>
                )}
                {book.stock !== undefined && (
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Total Stock:</strong>{" "}
                    {book.stock}
                  </p>
                )}
                {book.available !== undefined && (
                  <p className="text-gray-700">
                    <strong className="text-gray-900">Tersedia:</strong>{" "}
                    {book.available} buku
                  </p>
                )}
              </div>
              {session && (
                <button
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {borrowing ? "Memproses..." : "Pinjam Buku"}
                </button>
              )}
              {!session && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    Silakan{" "}
                    <Link href="/login" className="underline font-semibold">
                      login
                    </Link>{" "}
                    untuk meminjam buku
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
