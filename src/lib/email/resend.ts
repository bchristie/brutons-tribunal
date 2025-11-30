import { Resend } from 'resend';
import { ReactElement } from 'react';

// Lazy initialization of Resend client to avoid client-side instantiation
let resendClient: Resend | null = null;

function getResendClient() {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
  scheduledAt?: string;
}

/**
 * Send an email using Resend
 * @param options Email options including recipient, subject, and React component
 * @returns Promise with the email ID or error
 */
export async function sendEmail(options: SendEmailOptions) {
  try {
    const { to, subject, react, from, replyTo } = options;
    const resend = getResendClient();

    const data = await resend.emails.send({
      from: from || 'Bruton\'s Tribunal <onboarding@resend.dev>', // Use resend.dev for testing
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      replyTo,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

/**
 * Send verification code email
 */
export async function sendVerificationEmail(
  to: string,
  userName: string,
  verificationCode: string
) {
  const { default: VerifyPhoneEmail } = await import('@/emails/VerifyPhone');
  
  return sendEmail({
    to,
    subject: 'Verify your phone number',
    react: VerifyPhoneEmail({ userName, verificationCode }),
  });
}

/**
 * Send invitation email
 */
export async function sendInvitationEmail(
  to: string,
  inviterName: string,
  inviteLink: string,
  organizationName?: string
) {
  const { default: InviteUserEmail } = await import('@/emails/InviteUser');
  
  return sendEmail({
    to,
    subject: `You've been invited to join ${organizationName || "Bruton's Tribunal"}`,
    react: InviteUserEmail({ inviterName, inviteLink, organizationName }),
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to: string, userName: string) {
  const { default: WelcomeEmail } = await import('@/emails/Welcome');
  
  return sendEmail({
    to,
    subject: 'Welcome to Bruton\'s Tribunal!',
    react: WelcomeEmail({ userName }),
    scheduledAt: 'in 5 minutes',
  });
}

// Export the getter function for direct access if needed
export const getResend = getResendClient;
