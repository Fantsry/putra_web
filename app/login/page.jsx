// app/login/page.jsx
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Redirect jika sudah login
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (session.user.role === "guru") {
        router.replace("/dashboard/guru");
      } else {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  // Jangan tampilkan form jika sedang loading atau sudah login
  if (status === "loading" || (status === "authenticated" && session?.user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Mengalihkan...</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    if (result?.error) {
      setMessage(result.error || "Login gagal, periksa kembali data Anda.");
      return;
    }

    // login sukses → tunggu session update, useEffect akan handle redirect
    if (result?.ok) {
      // Refresh untuk update session
      window.location.href = "/";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="mb-4">
            <Link
              href="/"
              className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
          <h1
            className="text-3xl font-bold mb-6 text-center text-gray-900"
          >
            Login
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {message && (
            <p className="text-center mt-4 text-red-600 font-semibold">
              {message}
            </p>
          )}

          <p className="text-center mt-6 text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-blue-600 underline font-semibold"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
