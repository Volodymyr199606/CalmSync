'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

/**
 * Delete Account Button Component
 * Displays a confirmation dialog before permanently deleting the user account
 */
export function DeleteAccountButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Account deleted successfully - redirect to home
      router.push('/?deleted=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setConfirmText('');
    setError(null);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700"
      >
        Delete My Account
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">
              Delete Account
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                This action is permanent and cannot be undone.
              </p>
              <p>Deleting your account will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Permanently delete all your mood check-ins</li>
                <li>Remove all relaxation session history</li>
                <li>Delete your account profile and settings</li>
                <li>Log you out of all devices</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you&apos;re sure you want to proceed, type{' '}
                <span className="font-mono font-bold">DELETE</span> below to confirm.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Type DELETE to confirm"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError(null);
              }}
              disabled={isDeleting}
              className="font-mono"
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || confirmText !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete My Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

