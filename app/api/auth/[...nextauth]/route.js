import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const conn = await pool.getConnection();
        try {
          const [rows] = await conn.query(
            "SELECT id, name, email, password, role FROM users WHERE email=? LIMIT 1",
            [email]
          );
          if (!rows[0]) return null;
          const user = rows[0];
          const ok = await verifyPassword(password, user.password);
          if (!ok) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } finally {
          conn.release();
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  secret: process.env.NEXTAUTH_SECRET || "default-secret-key-change-in-production",

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    // gunakan halaman /login agar konsisten dengan navigasi utama
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
