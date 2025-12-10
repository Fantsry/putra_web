import Link from "next/link";

export default function Header() {
  return (
    <header>
      <Link href="/register">
        <button className="bg-white …">Register</button>
      </Link>
      <Link href="/login">
        <button className="border …">Login</button>
      </Link>
    </header>
  );
}
