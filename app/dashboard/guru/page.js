// app/dashboard/guru/page.js
import pool from "@/lib/db";
import { approveBorrowRequest, rejectBorrowRequest } from "./actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const revalidate = 0;

export default async function GuruDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "guru") {
    redirect("/login");
  }

  let pendingRequests = [];
  try {
    // Query borrows yang masih aktif (borrowed)
    const [requests] = await pool.query(`
      SELECT 
        b.id,
        b.borrow_date as request_date,
        b.due_date,
        u.name AS user_name,
        u.email,
        bk.title,
        bk.author,
        bk.image
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status = 'borrowed'
      ORDER BY b.borrow_date DESC
    `);
    pendingRequests = requests;
  } catch (error) {
    console.error("Error fetching borrows:", error);
    pendingRequests = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard Guru — Persetujuan Peminjaman
        </h1>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              Belum ada request peminjaman baru
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {req.image ? (
                      <Image
                        src={req.image}
                        alt={req.title}
                        width={80}
                        height={120}
                        className="rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-lg w-20 h-32" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {req.title}
                      </h3>
                      <p className="text-sm text-gray-600">{req.author}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-gray-700">
                        Peminjam:
                      </span>{" "}
                      {req.user_name}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">
                        NIPD/Email:
                      </span>{" "}
                      {req.nipd || req.email}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">
                        Tanggal Pinjam:
                      </span>{" "}
                      {new Date(req.request_date).toLocaleDateString("id-ID")}
                    </p>
                    {req.due_date && (
                      <p>
                        <span className="font-medium text-gray-700">
                          Jatuh Tempo:
                        </span>{" "}
                        {new Date(req.due_date).toLocaleDateString("id-ID")}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <form
                      action={async () => {
                        "use server";
                        await approveBorrowRequest(req.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm"
                      >
                        Setujui
                      </button>
                    </form>

                    <form
                      action={async () => {
                        "use server";
                        await rejectBorrowRequest(req.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 font-medium text-sm"
                      >
                        Tolak
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
