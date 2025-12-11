"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowStats, setBorrowStats] = useState({
    total: 0,
    borrowed: 0,
    returned: 0,
    late: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.id) {
      fetchUserData();
      fetchBorrowStats();
    }
  }, [session, status, router]);

  async function fetchUserData() {
    try {
      const res = await fetch(`/api/users/${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBorrowStats() {
    try {
      const res = await fetch(`/api/borrows/history/${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBorrowStats({
          total: data.length,
          borrowed: data.filter((b) => b.status === "borrowed").length,
          returned: data.filter((b) => b.status === "returned").length,
          late: data.filter((b) => b.status === "late").length,
        });
      }
    } catch (error) {
      console.error("Error fetching borrow stats:", error);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-gray-600 text-lg">Memuat profil...</p>
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
            href={session.user.role === "admin" ? "/dashboard/admin" : session.user.role === "guru" ? "/dashboard/guru" : "/"}
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            ← Kembali
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {session.user.name || "User"}
                </h1>
                <p className="text-blue-100">{session.user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  {session.user.role === "admin" ? "👑 Admin" : session.user.role === "guru" ? "👨‍🏫 Guru" : "👤 Member"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Total Peminjaman</p>
                <p className="text-3xl font-bold text-blue-600">{borrowStats.total}</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600 mb-2">Sedang Dipinjam</p>
                <p className="text-3xl font-bold text-yellow-600">{borrowStats.borrowed}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-2">Sudah Dikembalikan</p>
                <p className="text-3xl font-bold text-green-600">{borrowStats.returned}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <p className="text-sm text-gray-600 mb-2">Terlambat</p>
                <p className="text-3xl font-bold text-red-600">{borrowStats.late}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Informasi Akun</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-semibold">{session.user.name || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{session.user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-semibold capitalize">{session.user.role}</span>
                </div>
                {userData?.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bergabung:</span>
                    <span className="font-semibold">
                      {new Date(userData.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/profile/history"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                📖 Lihat History Peminjaman
              </Link>
              {session.user.role === "admin" && (
                <Link
                  href="/dashboard/admin"
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  ⚙️ Dashboard Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
