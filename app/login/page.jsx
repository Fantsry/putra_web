// app/login/page.jsx
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1e293b",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          padding: "3rem",
          borderRadius: "1rem",
          backdropFilter: "blur(10px)",
          width: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "2rem",
            textAlign: "center",
            color: "#1e293b",
            fontWeight: "bold",
          }}
        >
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              backgroundColor: "#ffffff",
              color: "#1e293b",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              backgroundColor: "#ffffff",
              color: "#1e293b",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "1rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "1rem",
              boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 150ms ease",
            }}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: "#ef4444",
              fontWeight: "600",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "2rem", color: "#64748b" }}>
          Belum punya akun?{" "}
          <a
            href="/register"
            style={{
              color: "#3b82f6",
              textDecoration: "underline",
              fontWeight: "500",
            }}
          >
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
