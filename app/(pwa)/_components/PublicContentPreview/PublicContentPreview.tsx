import Link from 'next/link';
import type { PublicContentPreviewProps } from './PublicContentPreview.types';

const contentCards = [
  {
    id: 'case-study',
    title: 'New Case Study Published',
    description: 'Explore our latest analysis of landmark legal decisions...',
    linkText: 'Sign in to read more →',
    linkHref: '/pwa/join'
  },
  {
    id: 'ai-ethics',
    title: 'Community Discussion: Ethics in AI',
    description: 'Join the conversation about artificial intelligence in legal practice...',
    linkText: 'Join the discussion →',
    linkHref: '/pwa/join'
  },
  {
    id: 'upcoming-events',
    title: 'Upcoming Events',
    description: "Don't miss our virtual networking session this Friday...",
    linkText: 'RSVP required →',
    linkHref: '/pwa/join'
  }
];

export function PublicContentPreview({ className = '' }: PublicContentPreviewProps) {
  return (
    <div className={`px-4 pb-12 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Latest Updates
      </h3>
      
      {/* Sample content cards */}
      <div className="space-y-4">
        {contentCards.map((card) => (
          <div key={card.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {card.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {card.description}
            </p>
            <Link 
              href={card.linkHref}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              {card.linkText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}