"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // NIPD atau email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("siswa");

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        password,
        role,
        ...(role === "siswa" ? { nipd: identifier } : { email: identifier }),
      }),
    });
    const data = await res.json();
    if (res.ok) alert("Registrasi berhasil, silahkan login!");
    else alert(data.error);
  }

  return (
    <form onSubmit={handleRegister}>
      <input
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder={role === "siswa" ? "NIPD" : "Email"}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="siswa">Siswa</option>
        <option value="umum">Umum</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
}
