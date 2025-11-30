'use client';

import { useState } from 'react';
import { Modal } from '../Modal';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';

export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setSuccess(true);
      setEmail('');
      
      // Close modal after showing success for a moment
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite User"
      description="Send an invitation email to a new user"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
            disabled={isLoading || success}
            className="
              w-full px-4 py-2 rounded-lg
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            An invitation email will be sent to this address with a link to join the tribunal.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <FaCheckCircle className="text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-600 dark:text-green-400">
              Invitation sent successfully!
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="
              px-4 py-2 rounded-lg
              bg-gray-200 dark:bg-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-600
              text-gray-900 dark:text-white
              font-medium transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !email || success}
            className="
              px-4 py-2 rounded-lg
              bg-blue-600 hover:bg-blue-700
              text-white font-medium
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            "
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : success ? (
              <>
                <FaCheckCircle className="w-4 h-4" />
                Sent!
              </>
            ) : (
              <>
                <FaPaperPlane className="w-4 h-4" />
                Send Invitation
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
