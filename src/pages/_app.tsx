import "@/styles/globals.css";
import type { AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import StringMatcherProvider from "@/contexts/StringMatcherProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatSessionProvider from "@/contexts/ChatSessionProvider";

const queryClient = new QueryClient();

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ChatSessionProvider>
          <StringMatcherProvider>
            <Component {...pageProps} />
          </StringMatcherProvider>
        </ChatSessionProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
