import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./data/user";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        // If validation fails, return null
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data; // Access data only if validation is successful

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
