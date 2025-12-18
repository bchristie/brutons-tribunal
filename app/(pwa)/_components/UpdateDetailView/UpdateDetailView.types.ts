export interface Update {
  id: string;
  title: string;
  description: string;
  content?: string | null;
  type: string;
  time: string;
  icon: React.ReactNode;
  featured: boolean;
  author: string;
  tags: string[];
  linkHref?: string | null;
  linkText?: string | null;
}

export interface UpdateDetailViewProps {
  update: Update;
  onClose?: () => void;
}
