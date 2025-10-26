import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 p-8">
      <div className="absolute inset-0 z-0 opacity-60">
        <div className="absolute top-[-10rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-blue-700 filter blur-3xl" />
        <div className="absolute bottom-[-15rem] right-[-15rem] h-[40rem] w-[40rem] rounded-full bg-blue-900 filter blur-3xl" />
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Link href="/" className="text-white/80 hover:text-white">
          &larr; Kembali ke Beranda
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}