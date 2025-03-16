import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from "./data/user";
import { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // When a user tries to access a protected page but is not authenticated, they will be redirected to the /auth/login page.
  // If an authentication error occurs (e.g., wrong credentials, OAuth issues), the user will be redirected to /auth/error.
  pages: {
    signIn: "/auth/login", // Redirect users to this page when authentication is required
    error: "/auth/error", // Redirect users to this page if an authentication error occurs
  },
  // The linkAccount event triggers when a user links a new OAuth provider (e.g., Google, GitHub, etc.) to their existing account.
  // When an account is linked, the user's emailVerified field is updated with the current date to mark them as verified.
  //   A user signs in with GitHub for the first time → The event does not trigger.
  // Later, they link a Google account to the same profile → The linkAccount event triggers and marks emailVerified with the current date.
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }, // Mark user as verified when linking an account
      });
    },
  },
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
