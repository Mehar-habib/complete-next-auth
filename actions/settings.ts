"use server";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // Retrieve the currently authenticated user
  const user = await currentUser();

  // If there is no user or the user ID is missing, return an unauthorized error
  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  // Fetch the user details from the database using the user ID
  const dbUser = await getUserById(user.id);

  // If the user does not exist in the database, return an unauthorized error
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // If the user signed in using OAuth, prevent updating certain fields
  if (user.isOAuth) {
    values.email = undefined; // Prevent email update
    values.password = undefined; // Prevent password update
    values.newPassword = undefined; // Prevent setting a new password
    values.isTowFactorEnabled = undefined; // Prevent enabling/disabling 2FA
  }

  // If the user is attempting to change their email and it's different from the current one
  if (values.email && values.email !== user.email) {
    // Check if the new email is already in use by another user
    const existingUser = await getUserByEmail(values.email);

    // If the email is taken by another user, return an error
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }

    // Generate an email verification token for the new email
    const verificationToken = await generateVerificationToken(values.email);

    // Send a verification email to the user
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    // Inform the user to verify their new email
    return { success: "Please check your email to verify your account." };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { ...values },
  });
  return { success: "Settings updated" };
};
