"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterSiswaPage() {
  const [name, setName] = useState("");
  const [nipd, setNipd] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();

    if (!name || !nipd || !password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          password,
          role: "siswa",
          nipd,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil, silakan login!");
        router.push("/auth/login");
      } else {
        alert(data.error || "Gagal registrasi");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan, coba lagi");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Registrasi Siswa
        </h2>

        <input
          type="text"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="NIPD"
          value={nipd}
          onChange={(e) => setNipd(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Daftar
        </button>
      </form>
    </div>
  );
}
