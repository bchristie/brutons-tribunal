export interface ContactFormProps {
  title?: string;
  className?: string;
  variant?: 'dark' | 'light';
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}