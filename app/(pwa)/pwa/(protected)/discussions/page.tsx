import { MdForum } from 'react-icons/md';

export default function DiscussionsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Discussions
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <MdForum className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Discussions Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Join meaningful conversations with legal professionals and thought leaders.
        </p>
      </div>
    </div>
  );
}