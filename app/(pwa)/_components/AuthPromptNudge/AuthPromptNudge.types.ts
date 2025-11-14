export interface AuthPromptNudgeProps {
  className?: string;
  onSignIn?: (callbackUrl?: string) => void;
  callbackUrl?: string;
}