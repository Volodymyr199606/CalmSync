import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DeleteAccountButton } from '@/components/settings/DeleteAccountButton';

/**
 * Settings page with account management options
 * Requires authentication
 */
export default async function SettingsPage() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      redirect('/');
    }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Account Information */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              Email
            </label>
            <p className="text-base font-medium text-gray-800 dark:text-gray-200">{user.email}</p>
          </div>
          {user.name && (
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                Name
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Privacy & Legal */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Privacy & Legal</h2>
        <div className="space-y-2">
          <Link
            href="/privacy"
            className="block text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="block text-blue-600 dark:text-blue-400 hover:underline"
          >
            Terms of Service
          </Link>
          <Link
            href="/safety"
            className="block text-blue-600 dark:text-blue-400 hover:underline"
          >
            Safety Resources
          </Link>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-300 dark:border-red-700">
        <h2 className="text-2xl font-semibold mb-4 text-red-700 dark:text-red-400">
          Danger Zone
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Permanently delete your account and all associated data. This action cannot
              be undone.
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </Card>
    </div>
  );
}

