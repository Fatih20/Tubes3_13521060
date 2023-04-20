import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaClient } from "@prisma/client";

// https://authjs.dev/guides/basics/role-based-authentication

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {},
  pages: {
    signIn: "/login",
    verifyRequest: "/redirect",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
};

export default NextAuth(authOptions);
