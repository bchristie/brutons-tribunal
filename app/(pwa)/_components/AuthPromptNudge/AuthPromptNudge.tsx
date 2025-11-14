import type { AuthPromptNudgeProps } from './AuthPromptNudge.types';

export function AuthPromptNudge({ 
  className = '', 
  onSignIn, 
  callbackUrl 
}: AuthPromptNudgeProps) {
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn(callbackUrl);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 ${className}`}
      style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Ready to unlock the full experience?
        </p>
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}