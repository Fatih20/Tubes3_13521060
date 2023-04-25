import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import NotLoggedIn from "@/components/NotLoggedIn";
import Sidebar from "@/components/Sidebar";
import { useChatSessionContext } from "@/contexts/ChatSessionProvider";
import ChatScreen from "@/components/ChatScreen";
import LoadingCircle from "@/components/LoadingCircle";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session, status } = useSession();
  const { chatSession } = useChatSessionContext();
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {status === "loading" ? (
        <LoadingCircle />
      ) : !session ? (
        <NotLoggedIn />
      ) : (
        <div className="flex w-full items-stretch justify-start h-full flex-grow">
          <Sidebar />
          {chatSession !== "" ? (
            <ChatScreen />
          ) : (
            <section className="flex flex-col flex-grow w-full items-center justify-center box-border p-6 gap-2 bg-base-100">
              <h2 className="text-3xl font-bold text-center">
                You have not selected any chat session.
              </h2>
              <p className="text-lg">
                Select existing chat session on the sidebar or create a new one.
              </p>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
