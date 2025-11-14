import { MdEvent } from 'react-icons/md';

export default function EventsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Events
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <MdEvent className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Events Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover webinars, networking events, and professional development opportunities.
        </p>
      </div>
    </div>
  );
}