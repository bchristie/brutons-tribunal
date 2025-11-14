export default function DiscussionsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Discussions
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
        </svg>
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