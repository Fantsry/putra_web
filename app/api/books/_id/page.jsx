"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then(setBook)
      .catch(console.error);
  }, [id]);

  async function handleBorrow() {
    const res = await fetch("/api/borrows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: id }),
    });
    const data = await res.json();
    if (res.ok) alert("Request pinjam berhasil!");
    else alert(data.error);
  }

  if (!book) return <p>Loading...</p>;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      <p>{book.description}</p>
      <button onClick={handleBorrow}>Pinjam</button>
    </div>
  );
}
