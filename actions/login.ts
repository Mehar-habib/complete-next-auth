"use server";
import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid email or password!" };
  }
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.password || !existingUser.email)
    return { error: "Email does not exist!" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(existingUser.email, verificationToken.token);
    return { success: "Please check your email to verify your account." };
  }
  // Check if the user has enabled two-factor authentication (2FA) and has a valid email
  if (existingUser.isTowFactorEnabled && existingUser.email) {
    // If a code is provided (user is trying to authenticate)
    if (code) {
      // Retrieve the stored 2FA token for the user's email
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      // If no token exists, return an error
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      // If the provided code does not match the stored token, return an error
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      // Check if the token has expired
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code has expired!" };
      }

      // If the code is valid, remove it from the database to prevent reuse
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      // Check if there is an existing 2FA confirmation record for the user
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      // If a confirmation record exists, delete it to ensure a fresh confirmation
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      // Create a new 2FA confirmation entry for the user
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
          expires: new Date(new Date().getTime() + 3600 * 1000),
        },
      });
    } else {
      // If no code is provided (user is attempting to log in), generate a new 2FA token
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      // Send the newly generated 2FA token to the user's email
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      // Return a response indicating that 2FA is required
      return { twoFactor: true };
    }
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
