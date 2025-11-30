import { Text } from '@react-email/components';
import { EmailLayout, Button } from './_components';
import { buildUrl } from '@/src/lib/utils/url';

interface WelcomeEmailProps {
  userName: string;
}

/**
 * Welcome email sent to new users after signup
 */
export default function WelcomeEmail({ userName }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Bruton's Tribunal!">
      <Text style={styles.greeting}>Welcome, {userName}!</Text>
      
      <Text style={styles.paragraph}>
        Thank you for joining Bruton's Tribunal. We're excited to have you on board!
      </Text>

      <Text style={styles.paragraph}>
        Here are a few things you can do to get started:
      </Text>

      <ul style={styles.list}>
        <li style={styles.listItem}>Complete your profile</li>
        <li style={styles.listItem}>Explore the latest updates</li>
        <li style={styles.listItem}>Connect with other members</li>
      </ul>

      <div style={styles.buttonContainer}>
        <Button href={buildUrl('/admin')}>Get Started</Button>
      </div>

      <Text style={styles.paragraph}>
        If you have any questions, feel free to reach out to our support team.
      </Text>

      <Text style={styles.signature}>
        Best regards,<br />
        The Bruton's Tribunal Team
      </Text>
    </EmailLayout>
  );
}

WelcomeEmail.PreviewProps = {
  userName: 'John Doe',
} as WelcomeEmailProps;

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
  list: {
    fontSize: '16px',
    color: '#525252',
    lineHeight: '28px',
    paddingLeft: '20px',
    marginBottom: '16px',
  },
  listItem: {
    marginBottom: '8px',
  },
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '24px 0',
  },
  signature: {
    fontSize: '16px',
    color: '#525252',
    lineHeight: '24px',
    marginTop: '32px',
  },
};
