# Email Templates

This directory contains React-based email templates using [React Email](https://react.email) and [Resend](https://resend.com).

## Structure

```
emails/
├── _components/          # Shared components for all emails
│   ├── EmailLayout.tsx   # Main layout wrapper with header/footer
│   ├── Button.tsx        # Reusable button component
│   └── index.ts          # Component exports
├── VerifyPhone.tsx       # Phone verification email
├── InviteUser.tsx        # User invitation email
└── Welcome.tsx           # Welcome email for new users
```

## Usage

### Send an email

```typescript
import { sendVerificationEmail } from '@/src/lib/email';

// Send phone verification
await sendVerificationEmail(
  'user@example.com',
  'John Doe',
  '123456'
);
```

### Create a new email template

1. Create a new file in `emails/` (e.g., `PasswordReset.tsx`)
2. Use the `EmailLayout` wrapper for consistent branding
3. Export as default function with TypeScript props

```typescript
import { Text } from '@react-email/components';
import { EmailLayout, Button } from './_components';

interface PasswordResetEmailProps {
  userName: string;
  resetLink: string;
}

export default function PasswordResetEmail({ 
  userName, 
  resetLink 
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Text>Hi {userName}!</Text>
      <Text>Click below to reset your password:</Text>
      <Button href={resetLink}>Reset Password</Button>
    </EmailLayout>
  );
}

// Preview props for development
PasswordResetEmail.PreviewProps = {
  userName: 'John Doe',
  resetLink: 'https://yoursite.com/reset/abc123',
} as PasswordResetEmailProps;
```

4. Add a helper function in `src/lib/email/resend.ts`:

```typescript
export async function sendPasswordResetEmail(
  to: string,
  userName: string,
  resetLink: string
) {
  const { default: PasswordResetEmail } = await import('@/emails/PasswordReset');
  
  return sendEmail({
    to,
    subject: 'Reset your password',
    react: PasswordResetEmail({ userName, resetLink }),
  });
}
```

## Development

### Preview emails locally

You can preview emails by importing them directly:

```typescript
import VerifyPhoneEmail from '@/emails/VerifyPhone';

// In your development environment
<VerifyPhoneEmail 
  userName="Test User"
  verificationCode="123456"
/>
```

### Test email sending

```typescript
import { sendEmail } from '@/src/lib/email';
import TestEmail from '@/emails/Test';

const result = await sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  react: TestEmail({ name: 'Test' }),
});

console.log(result.success ? 'Sent!' : 'Failed:', result.error);
```

## Customization

### Update branding

Edit `emails/_components/EmailLayout.tsx` to change:
- Header background color
- Logo/company name
- Footer links
- Overall styling

### Add new shared components

Create components in `emails/_components/` and export them from `index.ts` to use across all email templates.

## Environment Variables

Required in `.env`:

```
RESEND_API_KEY=re_your_api_key_here
```

## Available Email Templates

- **VerifyPhone** - Phone number verification with code
- **InviteUser** - Invitation to join the platform
- **Welcome** - Welcome message for new users

## Best Practices

1. **Keep it simple** - Email clients have limited CSS support
2. **Use inline styles** - Defined in the component
3. **Test everywhere** - Different email clients render differently
4. **Responsive design** - Use max-width containers
5. **Alt text** - Add alt text for images
6. **Plain text** - Consider adding plain text versions for better deliverability
