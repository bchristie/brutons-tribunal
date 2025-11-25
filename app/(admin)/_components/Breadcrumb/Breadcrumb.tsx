'use client';

import Link from 'next/link';
import { useMobileDetection } from '@/src/hooks';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import type { BreadcrumbProps } from './Breadcrumb.types';

export function Breadcrumb({ items, mobileTitle, className = '' }: BreadcrumbProps) {
  const { isMobile } = useMobileDetection();

  // On mobile, show back button with title if there's a parent page
  if (isMobile) {
    const title = mobileTitle || items[items.length - 1]?.label || '';
    const parentItem = items.length > 1 ? items[items.length - 2] : null;
    
    if (parentItem && parentItem.href) {
      return (
        <div className={`mb-4 ${className}`}>
          <Link
            href={parentItem.href}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FaChevronLeft size={16} />
            <h1 className="text-xl font-bold">
              {title}
            </h1>
          </Link>
        </div>
      );
    }
    
    // No parent, just show title
    return (
      <div className={`mb-4 ${className}`}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
    );
  }

  // Desktop: Full breadcrumb navigation
  return (
    <nav className={`mb-6 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <FaChevronRight className="mx-2 text-gray-400" size={12} />
              )}
              {isLast || !item.href ? (
                <span className="text-gray-900 dark:text-white font-semibold">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
