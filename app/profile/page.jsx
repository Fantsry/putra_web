"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("/api/borrows/history/[USER_ID]") // ganti [USER_ID] dengan session.user.id
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>History Peminjaman</h1>
      {history.map((b) => (
        <div key={b.id}>
          <p>
            {b.title} - Status: {b.status}
          </p>
        </div>
      ))}
    </div>
  );
}
