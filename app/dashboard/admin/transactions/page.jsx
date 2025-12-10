"use client";

import { useEffect, useState } from "react";

export default function AdminTransactionsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/transactions");
      const json = await res.json();
      setData(json);
    }
    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">Transaksi & Denda</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">User</th>
            <th className="p-3">Jenis</th>
            <th className="p-3">Jumlah</th>
            <th className="p-3">Tanggal</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-3">{t.user_name}</td>
              <td className="p-3">{t.type}</td>
              <td className="p-3">{t.amount}</td>
              <td className="p-3">
                {new Date(t.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
