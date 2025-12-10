"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Halaman ini diarahkan ke /login agar tidak ada dua versi form login.
export default function LoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return <p style={{ padding: "1rem" }}>Mengalihkan ke halaman login...</p>;
}
