import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMagicLinkEmail(to: string, url: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured. Please set it in your environment variables.");
  }

  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  
  console.log("[EMAIL] Attempting to send magic link:", {
    to,
    from: fromEmail,
    hasApiKey: !!process.env.RESEND_API_KEY,
    apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 5) + "...",
  });

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: "Sign in to CalmSync",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(to right, #4F46E5, #7C3AED); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">CalmSync</h1>
              <p style="color: #E0E7FF; margin: 10px 0 0 0;">Your personal relaxation companion</p>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1F2937; margin-top: 0;">Sign in to CalmSync</h2>
              
              <p style="color: #4B5563; font-size: 16px;">
                Click the button below to sign in to your account. This link will expire in 24 hours.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" 
                   style="background: #4F46E5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Sign In to CalmSync
                </a>
              </div>
              
              <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
                Or copy and paste this URL into your browser:
              </p>
              <p style="color: #4F46E5; word-break: break-all; font-size: 14px; background: #F3F4F6; padding: 12px; border-radius: 4px;">
                ${url}
              </p>
              
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;">
              
              <p style="color: #9CA3AF; font-size: 13px; margin-bottom: 10px;">
                If you didn't request this email, you can safely ignore it.
              </p>
              
              <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; border-radius: 4px; margin-top: 20px;">
                <p style="color: #92400E; font-size: 13px; margin: 0;">
                  <strong>⚠️ Safety Notice:</strong> CalmSync is not a substitute for professional mental health care. 
                  If you're experiencing a crisis, please contact a mental health professional or emergency services.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #9CA3AF; font-size: 12px;">
              <p>© ${new Date().getFullYear()} CalmSync. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });

    // Check if the API returned an error
    if (result.error) {
      console.error("[EMAIL] Resend API error:", JSON.stringify(result.error, null, 2));
      const errorMessage = result.error.message || "Failed to send magic link email. Please check your Resend API configuration.";
      throw new Error(errorMessage);
    }

    // Log success
    if (result.data) {
      console.log("[EMAIL] Magic link email sent successfully:", {
        emailId: result.data.id,
        to,
        from: fromEmail,
      });
    } else {
      console.warn("[EMAIL] Resend API returned no error but also no data:", result);
    }
  } catch (error) {
    console.error("[EMAIL] Failed to send magic link email:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      to,
      from: fromEmail,
    });
    
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    
    // Handle unknown error types
    throw new Error("Failed to send magic link email. Please try again.");
  }
}

