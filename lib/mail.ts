import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
