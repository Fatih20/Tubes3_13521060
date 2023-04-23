import "@/styles/globals.css";
import type { AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import StringMatcher from "@/contexts/StringMatcher";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <StringMatcher>
        <Component {...pageProps} />
      </StringMatcher>
    </SessionProvider>
  );
};

export default App;
