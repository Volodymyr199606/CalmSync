import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Terms of Service page
 * Defines the legal agreement between CalmSync and users
 */
export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <Card className="p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Last Updated: November 26, 2025
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Agreement to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing or using CalmSync (&quot;the Service&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to
              these Terms, do not use the Service. We reserve the right to modify these
              Terms at any time, and your continued use of the Service constitutes
              acceptance of any changes.
            </p>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Service Description</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              CalmSync is a mental wellness application that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Mood tracking and check-in tools</li>
              <li>
                Personalized relaxation experiences (music, nature sounds, breathing
                exercises)
              </li>
              <li>Wellness resources and guided content</li>
              <li>Session history and progress tracking</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3 font-semibold">
              The Service is NOT a substitute for professional mental health care, medical
              advice, diagnosis, or treatment.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Eligibility</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You must be at least 13 years old to use CalmSync. If you are between 13 and
              18 years old, you must have parental or guardian consent to use the Service.
              By using the Service, you represent and warrant that you meet these
              eligibility requirements.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Account Registration</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              To use CalmSync, you must create an account by providing a valid email
              address. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Use only one account (no duplicate accounts)</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">5. Acceptable Use Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                Use the Service for any unlawful purpose or in violation of any applicable
                laws
              </li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>
                Interfere with or disrupt the Service or servers/networks connected to it
              </li>
              <li>
                Use automated scripts, bots, or scrapers to access or collect data from the
                Service
              </li>
              <li>
                Reverse engineer, decompile, or attempt to extract source code from the
                Service
              </li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>
                Use the Service to provide mental health services or counseling to others
              </li>
            </ul>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">6. User Content</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              You retain ownership of any data you submit to CalmSync (mood check-ins,
              notes, etc.). By using the Service, you grant us a limited license to use,
              store, and process your content solely to provide and improve the Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We may use anonymized, aggregated data for analytics, research, and service
              improvements. This anonymized data cannot be used to identify you personally.
            </p>
          </section>

          {/* Medical Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">7. Medical Disclaimer</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold">
                IMPORTANT: CalmSync is NOT a medical device or healthcare service.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  We do not provide medical advice, diagnosis, or treatment recommendations
                </li>
                <li>Our content is for informational and wellness purposes only</li>
                <li>
                  Always consult a qualified healthcare professional for medical concerns
                </li>
                <li>
                  Do not disregard professional medical advice based on anything you read
                  or experience in CalmSync
                </li>
                <li>
                  If you are experiencing a mental health crisis, seek immediate help from
                  emergency services or crisis hotlines
                </li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">8. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              All content provided by CalmSync (text, graphics, logos, images, audio,
              video, software) is owned by or licensed to CalmSync and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You may not copy, modify, distribute, sell, or create derivative works from
              our content without explicit written permission. All third-party content used
              in the Service is properly licensed. See our{' '}
              <Link
                href="/docs/content-licenses.md"
                className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
              >
                Content Licensing
              </Link>{' '}
              documentation for details.
            </p>
          </section>

          {/* Service Availability */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              9. Service Availability and Modifications
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We strive to provide reliable service, but we do not guarantee that CalmSync
              will be available 100% of the time. We may:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li>Modify, suspend, or discontinue the Service at any time</li>
              <li>Perform maintenance that temporarily interrupts access</li>
              <li>Update features, content, or functionality</li>
              <li>Remove or change content without notice</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              We are not liable for any interruption, delay, or unavailability of the
              Service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">10. Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              You may terminate your account at any time by using the account deletion
              feature in Settings. We may suspend or terminate your account if:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>You violate these Terms</li>
              <li>Your use poses a security risk</li>
              <li>You engage in fraudulent or illegal activity</li>
              <li>We are required to do so by law</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              Upon termination, your right to use the Service ceases immediately. Sections
              of these Terms that should survive termination will remain in effect
              (liability limitations, dispute resolution, etc.).
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">11. Disclaimers</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
              WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
              TO:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties of accuracy, reliability, or completeness</li>
              <li>Warranties that the Service will be uninterrupted or error-free</li>
              <li>
                Warranties that defects will be corrected or that the Service is free from
                viruses
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              12. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              TO THE FULLEST EXTENT PERMITTED BY LAW, CALMSYNC AND ITS AFFILIATES,
              OFFICERS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
              LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY
              LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers or your data</li>
              <li>Any bugs, viruses, or harmful code transmitted through the Service</li>
              <li>
                Any content obtained from the Service or actions taken based on such
                content
              </li>
              <li>
                Any personal injury or property damage resulting from use of the Service
              </li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">13. Indemnification</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You agree to indemnify, defend, and hold harmless CalmSync and its
              affiliates, officers, employees, and agents from any claims, liabilities,
              damages, losses, costs, or expenses (including reasonable attorneys&apos;
              fees) arising out of or related to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Any content you submit or share through the Service</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">14. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms are governed by and construed in accordance with the laws of the
              United States and the State of California, without regard to conflict of law
              principles. Any legal action or proceeding related to these Terms shall be
              brought exclusively in the courts located in California.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">15. Dispute Resolution</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have a dispute with CalmSync, please contact us first to attempt
              informal resolution. If we cannot resolve the dispute informally, you agree
              to submit to binding arbitration under the rules of the American Arbitration
              Association, except for claims that may be brought in small claims court.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">16. Severability</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If any provision of these Terms is found to be unenforceable or invalid, that
              provision shall be limited or eliminated to the minimum extent necessary, and
              the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          {/* Entire Agreement */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">17. Entire Agreement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms, together with our Privacy Policy, constitute the entire
              agreement between you and CalmSync regarding the Service and supersede all
              prior agreements and understandings.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">18. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              Email: legal@calmsync.app
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            See also:{' '}
            <Link
              href="/privacy"
              className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
            >
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link
              href="/safety"
              className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
            >
              Safety Resources
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

