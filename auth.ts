import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    // Modify session object before it is sent to the client
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // Assign user ID from token to session
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole; // Assign user role from token to session
      }
      return session; // Return updated session object
    },

    // Modify JWT before it is returned to the client
    async jwt({ token }) {
      if (!token.sub) return token; // If no user ID in token, return token as is

      const existingUser = await getUserById(token.sub); // Fetch user details from database
      if (!existingUser) return token; // If user not found, return token

      token.role = existingUser.role; // Assign user's role to token
      return token;
    },
  },

  adapter: PrismaAdapter(db), // Use Prisma adapter for managing authentication data
  session: { strategy: "jwt" }, // Use JWT-based session strategy
  ...authConfig, // Spread additional authentication configuration options
});
