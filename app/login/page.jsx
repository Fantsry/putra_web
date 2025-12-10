// app/login/page.jsx
export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)", // putih → abu muda
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#1e293b", // teks abu tua agar kontras
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
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            defaultValue="dau@gmail.com" // optional, sesuai screenshot
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
            style={{
              background: "#3b82f6", // biru tetap agar tombol menonjol
              color: "white",
              padding: "1rem",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1rem",
              boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
            }}
          >
            Masuk
          </button>
        </form>
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
