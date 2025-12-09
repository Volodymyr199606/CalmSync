import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Check your email
          </CardTitle>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            We&apos;ve sent you a magic link. Click it in your email to sign in securely.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Steps Section */}
          <div className="space-y-4">
            {/* Step 1: Magic link sent */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-3.5 w-3.5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  We&apos;ve sent you a magic link
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Click the link in your email to sign in securely
                </p>
              </div>
            </div>

            {/* Step 2: What to do next */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-3.5 w-3.5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  What to do next
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Click the link in the email to sign in. The link will expire in 24 hours for security.
                </p>
              </div>
            </div>
          </div>

          {/* Didn't receive it section */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Didn&apos;t receive it?
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-xs text-gray-500">
                <svg
                  className="h-2.5 w-2.5 text-gray-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Check spam/junk folder</span>
              </li>
              <li className="flex items-start gap-2 text-xs text-gray-500">
                <svg
                  className="h-2.5 w-2.5 text-gray-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Wait a minute and try again</span>
              </li>
            </ul>
          </div>

          {/* Back Button */}
          <div className="pt-4">
            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full text-sm font-medium"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

