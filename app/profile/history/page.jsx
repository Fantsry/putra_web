"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
      fetchHistory();
    }
  }, [session, status, router]);

  async function fetchHistory() {
    try {
      setLoading(true);
      const res = await fetch(`/api/borrows/history/${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        console.error("Failed to fetch history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "borrowed":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "returned":
        return "bg-green-100 text-green-800 border-green-300";
      case "late":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "borrowed":
        return "Sedang Dipinjam";
      case "returned":
        return "Sudah Dikembalikan";
      case "late":
        return "Terlambat";
      default:
        return status;
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-gray-600 text-lg">Memuat history...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            ← Kembali ke Profile
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📖 History Peminjaman
          </h1>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                Belum ada history peminjaman
              </p>
              <Link
                href="/books"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Jelajahi Buku
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-32 h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      ) : (
                        <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-4xl">
                          📚
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-1">
                            <strong>Penulis:</strong> {item.author || "-"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Tanggal Pinjam:</strong>
                          </p>
                          <p className="text-gray-900">
                            {item.borrow_date
                              ? new Date(item.borrow_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            <strong>Jatuh Tempo:</strong>
                          </p>
                          <p className="text-gray-900">
                            {item.due_date
                              ? new Date(item.due_date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "-"}
                          </p>
                        </div>
                        {item.return_date && (
                          <div>
                            <p className="text-sm text-gray-600">
                              <strong>Tanggal Kembali:</strong>
                            </p>
                            <p className="text-gray-900">
                              {new Date(item.return_date).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {item.status === "borrowed" && (
                        <Link
                          href={`/books/${item.book_id}`}
                          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Lihat Detail Buku
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
