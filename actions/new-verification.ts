"use server";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  // Retrieve the verification token from the database
  const existingToken = await getVerificationTokenByToken(token);

  // If the token does not exist, return an error message
  if (!existingToken) return { error: "Token does not exist!" };

  // Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };

  // Fetch the user associated with the token's email
  const existingUser = await getUserByEmail(existingToken.email);

  // If no user is found with the given email, return an error
  if (!existingUser) return { error: "Email does not exist!" };

  // Update the user's email verification status and ensure their email is set correctly
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(), // Set emailVerified to the current date-time
      email: existingToken.email, // Ensure email is properly updated
    },
  });

  // Delete the used verification token from the database to prevent reuse
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Return success message after successful verification
  return { success: "Email verified!" };
};

// Purpose of This Code:
// This code handles email verification in a secure and efficient way. It is part of an authentication system that ensures users confirm their email addresses before gaining full access to the application.
