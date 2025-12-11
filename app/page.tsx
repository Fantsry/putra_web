"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import "./globals.css"; // pastikan ini import CSS

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Jika sudah login, redirect berdasarkan role
    if (status === "authenticated" && session?.user) {
      if (session.user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (session.user.role === "guru") {
        router.push("/dashboard/guru");
      }
      // Jika member, tetap di halaman utama
    }
  }, [status, session, router]);

  const feedbacks = [
    {
      name: "Alif Alfathar",
      class: "XI RPL 1",
      text: "Perpustakaan digital memudahkan saya mencari referensi tugas tanpa ribet.",
    },
    {
      name: "Dennis Ali Fadillah",
      class: "XI RPL 1",
      text: "Peminjaman buku jadi cepat dan bisa dipantau kapan saja.",
    },
    {
      name: "Rega Syakib Ramadhan",
      class: "XI RPL 1",
      text: "Fitur rekomendasi buku sangat membantu untuk membaca sesuai minat.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-400 via-gray-300 to-gray-200 text-gray-900 py-48 px-6 flex flex-col items-center justify-center text-center">
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-gray-200 opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-10 -right-20 w-[500px] h-[500px] bg-gray-100 opacity-10 rounded-full blur-2xl" />
        <div className="absolute animate-pulse-slow top-20 right-1/4 w-24 h-24 bg-white/30 rounded-xl rotate-12 backdrop-blur-md" />
        <div className="absolute animate-pulse-slow bottom-20 left-1/4 w-16 h-16 bg-white/20 rounded-full backdrop-blur-md" />

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl leading-tight">
          Selamat Datang di{" "}
          <span className="text-gray-700 animate-glow">TB e-Library</span>
        </h1>

        <p className="text-lg md:text-2xl max-w-3xl mx-auto mb-10 text-gray-700 drop-shadow-md">
          Akses buku, referensi, dan informasi belajar secara cepat dan mudah.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/books"
            className="px-8 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-all"
          >
            Jelajahi Buku
          </Link>
          <button className="px-8 py-3 border border-gray-900 text-gray-900 font-semibold rounded-xl shadow-lg hover:bg-white hover:text-gray-700 hover:scale-105 transition-all">
            Pelajari Fitur
          </button>
        </div>
      </section>

      {/* WAVY TRANSITION */}
      <div className="relative h-[120px] overflow-hidden">
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#f3f4f6"
            fillOpacity="1"
            d="M0,224L60,208C120,192,240,160,360,154.7C480,149,600,171,720,181.3C840,192,960,192,1080,176C1200,160,1320,128,1380,112L1440,96V320H0Z"
          />
        </svg>
      </div>

      <main className="flex-grow">
        {/* FITUR UNGGULAN */}
        <section className="bg-gray-100 text-gray-900 pt-20 pb-20 relative z-10">
          <h2 className="text-4xl font-bold mb-12 text-center -mt-8">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-5">
            <div className="bg-gray-300 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Koleksi Buku Lengkap
              </h3>
              <p className="text-gray-700">
                Akses ribuan buku dan referensi digital dengan mudah.
              </p>
            </div>
            <div className="bg-gray-300 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Peminjaman Online
              </h3>
              <p className="text-gray-700">
                Pinjam buku digital kapan saja, tanpa harus ke perpustakaan.
              </p>
            </div>
            <div className="bg-gray-300 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Rekomendasi Buku
              </h3>
              <p className="text-gray-700">
                Sistem rekomendasi buku berdasarkan minat dan riwayat bacaan.
              </p>
            </div>
          </div>
        </section>

        {/* JENIS LAYANAN */}
        <section className="bg-gray-300 text-gray-900 py-16">
          <h2 className="text-4xl font-bold mb-10 text-center">
            Jenis Layanan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-5">
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Pencarian Buku
              </h3>
              <p className="text-gray-700">
                Cari buku berdasarkan judul, pengarang, atau kategori.
              </p>
            </div>
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Peminjaman Digital
              </h3>
              <p className="text-gray-700">
                Pinjam buku dan baca langsung dari perangkatmu.
              </p>
            </div>
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Wishlist & Favorit
              </h3>
              <p className="text-gray-700">
                Simpan buku favorit dan buat daftar bacaan pribadi.
              </p>
            </div>
            <div className="bg-gray-200 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform">
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                Review & Rating
              </h3>
              <p className="text-gray-700">
                Berikan review dan rating untuk membantu pembaca lain.
              </p>
            </div>
          </div>
        </section>

        {/* TESTIMONI */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Testimoni Pengguna
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {feedbacks.map((fb, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border border-gray-300"
                >
                  <div className="flex items-center mb-5">
                    <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">
                      {fb.name[0]}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">{fb.name}</h4>
                      <p className="text-sm text-gray-600">{fb.class}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{fb.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-200 text-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <img
              src="https://sekolahpedia.sekolahan.id/medias/logosekolah/SMK%20Taruna%20Bhakti.jpeg"
              alt="Logo Sekolah"
              className="w-20 h-20 mb-3"
            />
            <h3 className="text-xl font-bold">SMK TARUNA BHAKTI</h3>
            <p className="text-gray-700 mt-2">
              Perpustakaan Digital & Sistem Bacaan Siswa
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start mt-4">
            <p className="text-gray-700">
              Jalan Raya Pekapuran, Kelurahan Curug, Kecamatan Cimanggis, Kota
              Depok, Jawa Barat
            </p>
            <p className="text-gray-700">
              Telp: (021) 123456 | Email: info@sekolahcontoh.sch.id
            </p>
          </div>
          <div className="flex justify-center md:justify-end space-x-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/500px-Facebook_logo_%28square%29.png"
                alt="Facebook"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1024px-Instagram_logo_2022.svg.png"
                alt="Instagram"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"
                alt="YouTube"
                className="w-8 h-8"
              />
            </a>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-700 text-sm">
          &copy; {new Date().getFullYear()} SMK TARUNA BHAKTI. Semua hak cipta
          dilindungi.
        </div>
      </footer>
    </div>
  );
}
  