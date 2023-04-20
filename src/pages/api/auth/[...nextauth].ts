import NextAuth, { type NextAuthOptions } from "next-auth";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

// https://authjs.dev/guides/basics/role-based-authentication

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  // pages: {
  //   signIn: "/login",
  //   verifyRequest: "/redirect",
  // },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
};

export default NextAuth(authOptions);
