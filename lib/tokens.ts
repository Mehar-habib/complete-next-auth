import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator to create unique tokens
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};
// Function to generate a new email verification token
export const generateVerificationToken = async (email: string) => {
  // Generate a unique token using UUID
  const token = uuidv4();

  // Set token expiration time to 1 hour from the current time
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Check if a verification token already exists for the given email
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    // If an existing token is found, delete it to ensure only one token is active at a time
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create a new verification token in the database
  const verificationToken = await db.verificationToken.create({
    data: {
      email, // Associate token with the provided email
      token, // Store the generated token
      expires, // Set expiration time
    },
  });

  // Return the newly created verification token
  return verificationToken;
};
