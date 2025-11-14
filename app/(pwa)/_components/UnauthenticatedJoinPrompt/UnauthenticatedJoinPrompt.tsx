import { FaPeopleGroup } from 'react-icons/fa6';
import type { UnauthenticatedJoinPromptProps } from './UnauthenticatedJoinPrompt.types';

export function UnauthenticatedJoinPrompt({ 
  onSignIn,
  callbackUrl,
  className = ''
}: UnauthenticatedJoinPromptProps) {
  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn(callbackUrl);
    }
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <FaPeopleGroup className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Join the Jury
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Step into the halls of justice and prepare to preside over a panel of spirits in a trial by taste. 
        At Bruton's Tribunal, you are part of the jury, entrusted with the sacred duty of determining which
        pour deserves acclaim and which should be held in contempt.
      </p>
      <button
        onClick={handleSignIn}
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Serve on the Jury
      </button>
    </div>
  );
}