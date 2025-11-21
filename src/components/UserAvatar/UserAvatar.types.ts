export interface UserAvatarProps {
  // Flexible user data input
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles?: string[];
  
  // Display options
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  
  // Optional click handler for interactive uses
  onClick?: () => void;
  className?: string;
}

export interface RoleStyle {
  bg: string;
  text: string;
  label: string;
}
