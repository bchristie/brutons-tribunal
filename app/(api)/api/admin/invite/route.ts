import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/src/providers/auth/server';
import { Roles } from '@/src/lib/permissions/permissions';
import { prisma, permissionRepository } from '@/src/lib/prisma';
import { AuditLogRepository } from '@/src/lib/prisma/AuditLogRepository';
import { sendInvitationEmail } from '@/src/lib/email';
import { buildUrlWithParams } from '@/src/lib/utils/url';

/**
 * POST /api/admin/invite
 * Send an invitation email to a new user
 * Requires: ADMIN role
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role (required to invite users)
    const isAdmin = await permissionRepository.hasRole(user.id, Roles.ADMIN);

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin role required to invite users' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Generate a secure invitation token and store it in the database
    // For now, we'll use a placeholder token
    const inviteToken = `invite_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Build the invitation link with token and inviter name
    const inviteLink = buildUrlWithParams('/invite', {
      token: inviteToken,
      inviter: user.name || user.email.split('@')[0],
    });

    // Send invitation email
    const result = await sendInvitationEmail(
      email,
      user.name || user.email.split('@')[0],
      inviteLink,
      "Bruton's Tribunal"
    );

    if (!result.success) {
      console.error('Failed to send invitation email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    // Create audit log entry
    try {
      const auditLogRepository = new AuditLogRepository(prisma);
      await auditLogRepository.logInvitationSent(
        email,
        user.id
      );
    } catch (auditError) {
      // Log but don't fail the invitation if audit fails
      console.error('Failed to create audit log:', auditError);
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      email,
      inviteToken, // Return token for potential tracking
    });
  } catch (error) {
    console.error('Error in invite endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
