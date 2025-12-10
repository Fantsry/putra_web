"use client";

import { useState } from "react";

export default function AdminUsersPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role_id: 2, // default guru (admin = 1)
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (!res.ok) return alert("Gagal menambahkan user");

    alert("User berhasil ditambahkan");
    setForm({
      name: "",
      email: "",
      role_id: 2,
      password: "",
    });
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Tambah Guru / Admin</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Nama</label>
          <input
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Email Login</label>
          <input
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Role</label>
          <select
            className="w-full border p-2 rounded"
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          >
            <option value="1">Admin</option>
            <option value="2">Guru</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Simpan
        </button>
      </form>
    </div>
  );
}
