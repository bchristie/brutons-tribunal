export interface UnauthenticatedJoinPromptProps {
  onSignIn?: (callbackUrl?: string) => void;
  callbackUrl?: string;
  className?: string;
}