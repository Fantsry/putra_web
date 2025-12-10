"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBookPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category_id: "",
    description: "",
    cover_url: "",
    total_stock: 1,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/dashboard/admin/books");
    } else {
      alert("Gagal menambah buku");
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Tambah Buku Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block mb-1 capitalize">
              {key.replace("_", " ")}
            </label>
            <input
              className="w-full border p-2 rounded"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Simpan Buku
        </button>
      </form>
    </div>
  );
}
