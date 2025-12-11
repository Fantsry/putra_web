"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-gray-300 text-gray-900 p-5 shadow-md flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold hover:opacity-80 transition">
        TB e-Library
      </Link>
      <nav className="space-x-4 flex items-center">
        {status === "loading" ? (
          <span className="text-gray-600">Loading...</span>
        ) : session?.user ? (
          <>
            <Link
              href="/books"
              className="bg-white text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              📚 Buku
            </Link>
            {session.user.role === "admin" && (
              <Link
                href="/dashboard/admin"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Dashboard Admin
              </Link>
            )}
            {session.user.role === "guru" && (
              <Link
                href="/dashboard/guru"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Dashboard Guru
              </Link>
            )}
            <Link
              href="/profile"
              className="text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              👤 {session.user.name || session.user.email}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/books"
              className="bg-white text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              📚 Buku
            </Link>
            <Link
              href="/register"
              className="bg-white text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Daftar
            </Link>
            <Link
              href="/login"
              className="bg-transparent border border-gray-700 px-4 py-2 rounded hover:bg-white hover:text-gray-700 transition"
            >
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
