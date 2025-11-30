import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import { ReactNode } from 'react';
import { buildUrl } from '@/src/lib/utils/url';

interface EmailLayoutProps {
  children: ReactNode;
  preview?: string;
}

/**
 * Shared email layout with consistent branding
 * Wraps all email templates for consistent look and feel
 */
export function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && <Preview>{preview}</Preview>}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logo}>Bruton's Tribunal</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>
            {children}
          </Section>

          {/* Footer */}
          <Hr style={styles.hr} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Bruton's Tribunal. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              <Link href={buildUrl('/unsubscribe')} style={styles.link}>
                Unsubscribe
              </Link>
              {' • '}
              <Link href={buildUrl('/privacy')} style={styles.link}>
                Privacy Policy
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '40px auto',
    padding: '0',
    maxWidth: '600px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: '#0070f3',
    padding: '24px',
    textAlign: 'center' as const,
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0,
  },
  content: {
    padding: '32px 24px',
  },
  hr: {
    borderColor: '#e6ebf1',
    margin: '0',
  },
  footer: {
    padding: '24px',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '12px',
    color: '#8898aa',
    margin: '4px 0',
  },
  link: {
    color: '#0070f3',
    textDecoration: 'none',
  },
};
