'use client';

import { useAuth } from '@/src/providers/AuthProvider';

export default function AuthStatus() {
  const { user, isLoading, isAuthenticated, mode, signIn, signOut } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border">
        <div className="text-sm text-gray-600">Loading auth status...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border max-w-sm">
      <div className="space-y-2">
        <div className="text-sm font-semibold text-gray-800">
          Auth Status
        </div>
        
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">Mode:</span>
            <span className="font-mono text-blue-600">{mode}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Authenticated:</span>
            <span className={`font-mono ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          
          {user && (
            <div className="border-t pt-2 mt-2">
              <div className="text-gray-600 text-xs mb-1">User Details:</div>
              <div className="text-xs space-y-1">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.name || 'N/A'}</div>
                <div><strong>Roles:</strong> {(user as any).roles?.join(', ') || 'None'}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t pt-2 mt-2">
          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}