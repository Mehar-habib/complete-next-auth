import crypto from "crypto";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuidv4 } from "uuid"; // Import UUID generator to create unique tokens
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export const generateTwoFactorToken = async (email: string) => {
  // Generate a 6-digit random numeric token
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  // Set the expiration time for the token (currently 1 hour, but a TODO note suggests reducing it to 15 minutes)
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour from now

  // Check if a two-factor token already exists for this email
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    // If a token exists, delete it to ensure only one active token per user
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Create and store a new two-factor authentication token in the database
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email, // Associate the token with the provided email
      token, // Store the generated token
      expires, // Set the expiration time
    },
  });

  // Return the newly created token object
  return twoFactorToken;
};

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
