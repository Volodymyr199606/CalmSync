import { NextRequest, NextResponse } from 'next/server';
import { sendMagicLinkEmail } from '@/lib/email';

/**
 * Test endpoint to verify email sending works
 * GET /api/test-email?email=your@email.com
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testEmail = searchParams.get('email');

  if (!testEmail) {
    return NextResponse.json(
      { error: 'Please provide an email parameter: /api/test-email?email=your@email.com' },
      { status: 400 }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(testEmail)) {
    return NextResponse.json(
      { error: 'Invalid email format' },
      { status: 400 }
    );
  }

  try {
    // Create a test URL
    const testUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/resend?token=test-token&email=${encodeURIComponent(testEmail)}`;
    
    console.log('[TEST EMAIL] Attempting to send test email to:', testEmail);
    await sendMagicLinkEmail(testEmail, testUrl);
    
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}. Please check your inbox (and spam folder).`,
      email: testEmail,
    });
  } catch (error) {
    console.error('[TEST EMAIL] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send test email',
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}

