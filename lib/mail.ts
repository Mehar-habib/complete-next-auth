import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your Password",
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <h2 style="color: #007BFF; text-align: center;">Reset Your Password</h2>
        <p style="color: #333; font-size: 16px;">
          We received a request to reset your password. Click the button below to reset it:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
             style="background-color: #007BFF; color: white; padding: 12px 20px; 
             text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
             Reset Password
          </a>
        </div>
        <p style="color: #555; font-size: 14px;">
          If you did not request this, you can safely ignore this email. Your password will not change.
        </p>
        <p style="color: #777; font-size: 12px; text-align: center;">
          © 2025 YourCompany. All rights reserved.
        </p>
      </div>`,
  });
};
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; text-align: center;">
        <h2 style="color: #1E3A8A;">Verify Your Email</h2>
        <p style="color: #444; font-size: 16px;">
          Thank you for signing up! Please confirm your email address by clicking the button below.
        </p>
        <div style="margin: 20px 0;">
          <a href="${confirmLink}" 
            style="background-color: #155dfc; color: white; padding: 14px 24px; text-decoration: none; 
            font-size: 16px; font-weight: bold; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
