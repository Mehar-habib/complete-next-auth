import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const user = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return user;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const user = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return user;
  } catch {
    return null;
  }
};
