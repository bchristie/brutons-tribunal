import { Button as ReactEmailButton } from '@react-email/components';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

/**
 * Reusable button component for emails
 */
export function Button({ href, children, variant = 'primary' }: ButtonProps) {
  const style = variant === 'primary' ? styles.primary : styles.secondary;
  
  return (
    <ReactEmailButton href={href} style={style}>
      {children}
    </ReactEmailButton>
  );
}

const styles = {
  primary: {
    backgroundColor: '#0070f3',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600' as const,
    fontSize: '16px',
    display: 'inline-block',
  },
  secondary: {
    backgroundColor: '#ffffff',
    color: '#0070f3',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: '600' as const,
    fontSize: '16px',
    display: 'inline-block',
    border: '2px solid #0070f3',
  },
};
