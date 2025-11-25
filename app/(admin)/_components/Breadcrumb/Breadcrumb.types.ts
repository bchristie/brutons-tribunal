export interface BreadcrumbItem {
  label: string;
  href?: string; // If no href, it's the current page
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  mobileTitle?: string; // Optional simplified title for mobile
  className?: string;
}
