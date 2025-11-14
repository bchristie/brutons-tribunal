export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface AuthenticatedWelcomeProps {
  user: User;
  className?: string;
  dashboardHref?: string;
}