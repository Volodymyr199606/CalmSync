import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Privacy Policy page
 * Details how CalmSync collects, uses, and protects user data
 */
export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <Card className="p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          Last Updated: November 26, 2025
        </p>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Welcome to CalmSync. We respect your privacy and are committed to protecting
              your personal information. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our mental wellness
              application.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">
              1. Information You Provide to Us
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              <li>
                <strong>Account Information:</strong> Email address when you create an
                account
              </li>
              <li>
                <strong>Mood Check-In Data:</strong> Feelings, severity ratings, and
                optional notes you provide
              </li>
              <li>
                <strong>Session Data:</strong> Information about your relaxation sessions,
                including duration and content preferences
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">
              2. Information Automatically Collected
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, and time spent
                in the app
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, and
                device identifiers
              </li>
              <li>
                <strong>Log Data:</strong> IP address, access times, and error reports
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized relaxation experiences based on your mood</li>
              <li>Track your wellness journey over time</li>
              <li>Send you authentication emails (magic links)</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Monitor for security threats and fraudulent activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Data Sharing and Disclosure
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We do not sell your personal information. We may share your information only
              in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Service Providers:</strong> With third-party vendors who perform
                services on our behalf (hosting, analytics, email delivery)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, subpoena, or
                legal process
              </li>
              <li>
                <strong>Safety:</strong> To protect the rights, property, or safety of
                CalmSync, our users, or the public
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger,
                acquisition, or sale of assets
              </li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Vercel:</strong> Hosting and deployment
              </li>
              <li>
                <strong>Neon:</strong> Database hosting (PostgreSQL)
              </li>
              <li>
                <strong>Resend:</strong> Email delivery for authentication
              </li>
              <li>
                <strong>Sentry:</strong> Error tracking and performance monitoring
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              These services have their own privacy policies governing their use of your
              information.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We implement industry-standard security measures to protect your data,
              including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Secure authentication using magic links (no passwords stored)</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and least-privilege principles</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              However, no method of transmission over the Internet is 100% secure. While
              we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We retain your personal information for as long as your account is active or
              as needed to provide you services. You may request deletion of your account
              and data at any time from your Settings page. Upon deletion:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mt-3">
              <li>Your account and profile data will be permanently deleted</li>
              <li>All mood check-ins and relaxation session data will be removed</li>
              <li>Deletion is irreversible and cannot be undone</li>
              <li>
                Some anonymized data may be retained for analytics and legal compliance
              </li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Your Privacy Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>
                <strong>Access:</strong> Request a copy of the personal information we hold
                about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal information
              </li>
              <li>
                <strong>Portability:</strong> Request a machine-readable copy of your data
              </li>
              <li>
                <strong>Objection:</strong> Object to certain processing of your data
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              To exercise these rights, please contact us or use the account deletion
              feature in Settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Children&apos;s Privacy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              CalmSync is not intended for users under the age of 13. We do not knowingly
              collect personal information from children under 13. If you believe we have
              collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">International Users</h2>
            <p className="text-gray-700 dark:text-gray-300">
              CalmSync is operated in the United States. If you are accessing the service
              from outside the US, your information may be transferred to, stored, and
              processed in the US. By using our service, you consent to this transfer.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of
              any material changes by posting the new policy on this page and updating the
              &quot;Last Updated&quot; date. Your continued use of CalmSync after changes
              indicates your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions or concerns about this Privacy Policy or our data
              practices, please contact us at:
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              Email: privacy@calmsync.app
            </p>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            See also:{' '}
            <Link
              href="/terms"
              className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
            >
              Terms of Service
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

