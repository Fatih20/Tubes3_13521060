import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import NotLoggedIn from "@/components/NotLoggedIn";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {!session ? <NotLoggedIn /> : null}
    </main>
  );
}
