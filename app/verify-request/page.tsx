import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyRequestPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-16 sm:px-6 md:px-8 min-h-[calc(100vh-80px)] overflow-x-hidden">
      <div className="w-full max-w-lg mx-auto space-y-8 text-center">
        
        {/* Animated Email Icon */}
        <div className="flex justify-center">
          <div className="relative group">
            {/* Glowing background effect */}
            <div className="absolute inset-0 blur-2xl bg-purple-400/30 rounded-full -z-10 group-hover:blur-3xl transition-all duration-300 animate-pulse" />
            
            {/* Icon container */}
            <div className="relative bg-white rounded-full p-5 sm:p-6 shadow-xl border-0">
              <svg
                className="h-5 w-5 sm:h-14 sm:w-14 text-purple-600 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="backdrop-blur-lg bg-white/95 border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
          <CardHeader className="space-y-4 text-center pb-6 pt-8 sm:pt-10">
            {/* Decorative accent line */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-300 to-purple-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-purple-300 to-purple-400" />
            </div>

            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight break-words">
              Check your email
            </CardTitle>

            {/* Success indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <svg
                className="h-1 w-1 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.0}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium text-green-600 leading-tight break-words">
                Email sent successfully
              </span>
            </div>
          </CardHeader>

          {/* Description Box */}
          <div className="px-6 sm:px-8 mb-4">
            <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/60 backdrop-blur-sm rounded-xl border border-purple-100/50 p-6 sm:p-7 shadow-sm">
              <div className="text-center space-y-3">
                <p className="text-lg sm:text-xl text-gray-800 font-semibold leading-relaxed break-words">
                  We&apos;ve sent you a magic link
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md mx-auto break-words">
                  Click the link in your email to sign in securely
                </p>
              </div>
            </div>
          </div>

          <CardContent className="space-y-6 px-6 sm:px-8 pb-8 pt-0">
            {/* Instructions */}
            <div className="space-y-4">
              <div className="text-center space-y-2 p-4 rounded-lg bg-purple-50/50 border border-purple-100">
                <p className="text-sm font-medium text-gray-900 leading-tight break-words">
                  What to do next
                </p>
                <p className="text-sm text-gray-600 leading-relaxed break-words">
                  Click the link in the email to sign in. The link will expire in 24 hours for security.
                </p>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t border-gray-100 text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Didn&apos;t receive it?
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg
                      className="h-3 w-3 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="leading-tight break-words">Check your spam or junk folder</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg
                      className="h-3 w-3 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="leading-tight break-words">Wait a few minutes and try again</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4 flex justify-center">
              <Link href="/">
                <Button
                  variant="outline"
                  className="h-11 text-sm font-medium border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all duration-200 inline-flex items-center justify-center"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

        {/* Additional Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500 break-words">
            Need help?{" "}
            <Link
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors break-words"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

