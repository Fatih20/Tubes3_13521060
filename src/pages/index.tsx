import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, signIn, signOut } from "next-auth/react";
import NotLoggedIn from "@/components/NotLoggedIn";
import Sidebar from "@/components/Sidebar";
import Chatbox from "@/components/Chatbox";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {!session ? (
        <NotLoggedIn />
      ) : (
        <div className="flex w-full items-stretch justify-start h-full flex-grow">
          <Sidebar />
          <Chatbox />
        </div>
      )}
    </main>
  );
}
