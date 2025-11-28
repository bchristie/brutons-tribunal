import { Text, Section } from '@react-email/components';
import { EmailLayout, Button } from './_components';

interface VerifyPhoneEmailProps {
  userName: string;
  verificationCode: string;
}

/**
 * Email sent when user needs to verify their phone number
 */
export default function VerifyPhoneEmail({ 
  userName, 
  verificationCode 
}: VerifyPhoneEmailProps) {
  return (
    <EmailLayout preview="Verify your phone number">
      <Text style={styles.greeting}>Hi {userName}!</Text>
      
      <Text style={styles.paragraph}>
        Thank you for adding your phone number to your account. To complete the verification process, 
        please use the code below:
      </Text>

      <Section style={styles.codeSection}>
        <Text style={styles.code}>{verificationCode}</Text>
      </Section>

      <Text style={styles.paragraph}>
        This verification code will expire in <strong>10 minutes</strong>.
      </Text>

      <Text style={styles.paragraph}>
        If you didn't request this verification, you can safely ignore this email.
      </Text>

      <Text style={styles.signature}>
        Best regards,<br />
        The Bruton's Tribunal Team
      </Text>
    </EmailLayout>
  );
}

// For testing/preview in development
VerifyPhoneEmail.PreviewProps = {
  userName: 'John Doe',
  verificationCode: '123456',
} as VerifyPhoneEmailProps;

const styles = {
  greeting: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#1a1a1a',
    marginBottom: '16px',
  },
  paragraph: {
    fontSize: '16px',
    color: '#525252',
    lineHeight: '24px',
    marginBottom: '16px',
  },
  codeSection: {
    backgroundColor: '#f6f9fc',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center' as const,
    margin: '24px 0',
  },
  code: {
    fontSize: '32px',
    fontWeight: 'bold' as const,
    color: '#0070f3',
    letterSpacing: '8px',
    fontFamily: 'monospace',
    margin: 0,
  },
  signature: {
    fontSize: '16px',
    color: '#525252',
    lineHeight: '24px',
    marginTop: '32px',
  },
};
