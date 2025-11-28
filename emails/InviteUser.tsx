import { Text, Section } from '@react-email/components';
import { EmailLayout, Button } from './_components';

interface InviteUserEmailProps {
  inviterName: string;
  inviteLink: string;
  organizationName?: string;
}

/**
 * Email sent to invite new users to the platform
 */
export default function InviteUserEmail({ 
  inviterName, 
  inviteLink,
  organizationName = "Bruton's Tribunal"
}: InviteUserEmailProps) {
  return (
    <EmailLayout preview={`You've been invited to join ${organizationName}`}>
      <Text style={styles.greeting}>You're Invited!</Text>
      
      <Text style={styles.paragraph}>
        <strong>{inviterName}</strong> has invited you to join <strong>{organizationName}</strong>.
      </Text>

      <Text style={styles.paragraph}>
        Click the button below to accept the invitation and create your account:
      </Text>

      <Section style={styles.buttonSection}>
        <Button href={inviteLink}>Accept Invitation</Button>
      </Section>

      <Text style={styles.paragraph}>
        Or copy and paste this link into your browser:
      </Text>

      <Text style={styles.link}>
        {inviteLink}
      </Text>

      <Text style={styles.paragraph}>
        This invitation link will expire in <strong>7 days</strong>.
      </Text>

      <Text style={styles.signature}>
        Best regards,<br />
        The Bruton's Tribunal Team
      </Text>
    </EmailLayout>
  );
}

InviteUserEmail.PreviewProps = {
  inviterName: 'Jane Smith',
  inviteLink: 'https://yoursite.com/invite/abc123',
  organizationName: "Bruton's Tribunal",
} as InviteUserEmailProps;

const styles = {
  greeting: {
    fontSize: '28px',
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
  buttonSection: {
    textAlign: 'center' as const,
    margin: '32px 0',
  },
  link: {
    fontSize: '14px',
    color: '#0070f3',
    wordBreak: 'break-all' as const,
    padding: '12px',
    backgroundColor: '#f6f9fc',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  signature: {
    fontSize: '16px',
    color: '#525252',
    lineHeight: '24px',
    marginTop: '32px',
  },
};
