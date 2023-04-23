import "@/styles/globals.css";
import type { AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import StringMatcherProvider from "@/contexts/StringMatcherProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <StringMatcherProvider>
          <Component {...pageProps} />
        </StringMatcherProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
