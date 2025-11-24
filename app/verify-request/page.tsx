import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CalmSync</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your personal relaxation companion
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  className="h-12 w-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you a magic link to sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>✓ Email sent!</strong>
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Click the link in the email to sign in to your account. The link will expire in 24 hours.
              </p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">What to do next:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Check your inbox for an email from CalmSync</li>
                <li>Click the &quot;Sign In to CalmSync&quot; button in the email</li>
                <li>You&apos;ll be automatically signed in</li>
              </ol>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Didn&apos;t receive the email?</strong>
              </p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• The email might take a few minutes to arrive</li>
                <li>• You can close this page and return to sign in again</li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <a
                href="/"
                className="text-sm text-primary hover:underline"
              >
                ← Back to sign in
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

