"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export default function AdminUsersPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member", // default member, bisa admin atau member
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Gagal menambahkan user");
      return;
    }

    alert("User berhasil ditambahkan");
    setForm({
      name: "",
      email: "",
      role: "member",
      password: "",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard/admin"
            className="text-blue-600 hover:underline flex items-center gap-2"
          >
            ← Kembali ke Dashboard Admin
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold mb-6">Tambah User Baru</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-semibold">Nama</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <select
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Simpan
        </button>
      </form>
        </div>
      </div>
    </div>
  );
}
