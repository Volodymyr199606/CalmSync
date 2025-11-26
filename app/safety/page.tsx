import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Safety notice and crisis resources page
 * Provides important disclaimers and emergency contacts
 */
export default function SafetyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <Card className="p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Safety & Crisis Resources</h1>

        {/* Emergency Notice */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            🚨 If you&apos;re in crisis
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-3">
            If you&apos;re experiencing a mental health emergency or having thoughts of
            self-harm, please seek immediate help:
          </p>
          <ul className="space-y-2 text-red-700 dark:text-red-300">
            <li>
              <strong>US National Suicide Prevention Lifeline:</strong>{' '}
              <a href="tel:988" className="underline hover:no-underline">
                988
              </a>{' '}
              (call or text)
            </li>
            <li>
              <strong>Crisis Text Line:</strong> Text{' '}
              <a href="sms:741741" className="underline hover:no-underline">
                HELLO to 741741
              </a>
            </li>
            <li>
              <strong>International:</strong> Visit{' '}
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                findahelpline.com
              </a>
            </li>
            <li>
              <strong>Emergency Services:</strong> Call 911 (US) or your local emergency
              number
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Important Disclaimer</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            CalmSync is a wellness tool designed to help you manage stress and practice
            relaxation techniques. It is <strong>not a substitute</strong> for professional
            mental health care, medical advice, diagnosis, or treatment.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our app provides:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li>Mood tracking and self-reflection tools</li>
            <li>Relaxation content (music, nature sounds, breathing exercises)</li>
            <li>General wellness resources and techniques</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            CalmSync does not provide therapy, counseling, or clinical treatment. If you
            are experiencing persistent mental health concerns, please consult with a
            licensed mental health professional.
          </p>
        </section>

        {/* When to Seek Professional Help */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            When to Seek Professional Help
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Consider reaching out to a mental health professional if you experience:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Persistent feelings of sadness, anxiety, or hopelessness</li>
            <li>Difficulty functioning in daily life or work</li>
            <li>Changes in sleep patterns or appetite</li>
            <li>Withdrawal from friends, family, or activities you once enjoyed</li>
            <li>Thoughts of self-harm or suicide</li>
            <li>Substance abuse or risky behaviors</li>
            <li>Symptoms that interfere with your relationships or quality of life</li>
          </ul>
        </section>

        {/* Finding Help */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Finding Professional Help</h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Therapy & Counseling</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <a
                    href="https://www.psychologytoday.com/us/therapists"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    Psychology Today Therapist Directory
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.betterhelp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    BetterHelp (online therapy)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.talkspace.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    Talkspace (online therapy)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Mental Health Organizations</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <a
                    href="https://www.nami.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    National Alliance on Mental Illness (NAMI)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.mhanational.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    Mental Health America
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.samhsa.gov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
                  >
                    SAMHSA National Helpline
                  </a>{' '}
                  - 1-800-662-4357
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Privacy Note */}
        <section className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Your Privacy & Data</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We take your privacy seriously. Your mood check-ins and usage data are stored
            securely and are never shared with third parties without your explicit
            consent. For more information, please review our{' '}
            <Link
              href="/privacy"
              className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            If you ever want to delete your account and all associated data, you can do
            so from your{' '}
            <Link
              href="/settings"
              className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
            >
              Settings
            </Link>{' '}
            page.
          </p>
        </section>
      </Card>
    </div>
  );
}

