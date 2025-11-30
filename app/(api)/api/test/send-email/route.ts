import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { sendVerificationEmail, sendWelcomeEmail, sendInvitationEmail } from '@/src/lib/email';
import { buildUrl, buildUrlWithParams } from '@/src/lib/utils/url';

/**
 * POST /api/test/send-email
 * Test endpoint for sending emails (development only)
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    );
  }

  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type = 'verification', to, userName, verificationCode } = body;

    let result;
    
    switch (type) {
      case 'verification':
        result = await sendVerificationEmail(
          to || user.email,
          userName || user.name || 'User',
          verificationCode || '123456'
        );
        break;
        
      case 'welcome':
        result = await sendWelcomeEmail(
          to || user.email,
          userName || user.name || 'User'
        );
        break;
        
      case 'invitation':
        result = await sendInvitationEmail(
          to || user.email,
          user.name || 'Admin',
          buildUrlWithParams('/invite', {
            token: 'test-token-123',
            inviter: user.name || 'Admin'
          }),
          "Bruton's Tribunal"
        );
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully`,
        data: result.data,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in test email endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
