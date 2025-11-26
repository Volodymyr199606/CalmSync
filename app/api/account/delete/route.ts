import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { logger, extractErrorInfo } from '@/lib/logger';
import * as Sentry from '@sentry/nextjs';

/**
 * DELETE /api/account/delete
 * Permanently deletes the authenticated user's account and all associated data
 * This action is irreversible
 */
export async function DELETE(req: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      logger.warn('Unauthorized account deletion attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to delete your account.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    logger.info('Account deletion initiated', { userId });

    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        _count: {
          select: {
            moodCheckIns: true,
            relaxationSessions: true,
          },
        },
      },
    });

    if (!user) {
      logger.warn('Account deletion attempted for non-existent user', { userId });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log deletion details for audit purposes
    logger.info('Deleting user account', {
      userId: user.id,
      email: user.email,
      moodCheckInsCount: user._count.moodCheckIns,
      sessionsCount: user._count.relaxationSessions,
    });

    // Delete all user data in a transaction
    // Prisma cascade deletes will handle related records (accounts, sessions, etc.)
    await prisma.$transaction(async (tx) => {
      // Delete all mood check-ins (cascade will delete related relaxation sessions)
      await tx.moodCheckIn.deleteMany({
        where: { userId },
      });

      // Delete all relaxation sessions
      await tx.relaxationSession.deleteMany({
        where: { userId },
      });

      // Delete all accounts
      await tx.account.deleteMany({
        where: { userId },
      });

      // Delete all sessions
      await tx.session.deleteMany({
        where: { userId },
      });

      // Finally, delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    logger.info('Account successfully deleted', { userId, email: user.email });

    return NextResponse.json(
      {
        success: true,
        message: 'Your account and all associated data have been permanently deleted.',
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('Error deleting account', extractErrorInfo(error));
    Sentry.captureException(error, {
      tags: { operation: 'account_deletion' },
    });

    return NextResponse.json(
      {
        error: 'An error occurred while deleting your account. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/account/delete
 * Alternative method for account deletion (for form submissions)
 * Delegates to DELETE handler
 */
export async function POST(req: NextRequest) {
  return DELETE(req);
}

