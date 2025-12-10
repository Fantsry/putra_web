// app/dashboard/admin/page.jsx
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") redirect("/login");

  const [[stats]] = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM books) as total_books,
      (SELECT COUNT(*) FROM borrow_requests WHERE status = 'pending') as pending_requests,
      (SELECT COUNT(*) FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'guru')) as total_teachers,
      (SELECT COUNT(*) FROM borrow_requests WHERE status = 'active') as active_loans
  `);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Total Buku</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.total_books}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Request Menunggu</p>
            <p className="text-3xl font-bold text-orange-600">
              {stats.pending_requests}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Total Guru</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.total_teachers}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-600">Sedang Dipinjam</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.active_loans}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/admin/books"
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center border-2 border-dashed border-gray-300"
          >
            <div className="text-5xl mb-4">Book</div>
            <h3 className="text-xl font-semibold">Kelola Buku</h3>
          </Link>
          <Link
            href="/dashboard/admin/new"
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center border-2 border-dashed border-gray-300"
          >
            <div className="text-5xl mb-4">Teacher</div>
            <h3 className="text-xl font-semibold">Tambah Guru</h3>
          </Link>
          <Link
            href="/dashboard/admin/transactions"
            className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition text-center border-2 border-dashed border-gray-300"
          >
            <div className="text-5xl mb-4">Transaction</div>
            <h3 className="text-xl font-semibold">Transaksi</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
