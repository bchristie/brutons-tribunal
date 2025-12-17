'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownProps {
  children: string;
  className?: string;
}

/**
 * Markdown component for rendering markdown content with GitHub Flavored Markdown support
 * Includes sanitization for security
 */
export function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Customize heading styles
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />
          ),
          // Customize paragraph styles
          p: ({ node, ...props }) => (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props} />
          ),
          // Customize link styles
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Customize list styles
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1" {...props} />
          ),
          // Customize code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block p-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg overflow-x-auto text-sm font-mono mb-4"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Customize blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4"
              {...props}
            />
          ),
          // Customize table
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-left text-sm font-semibold text-gray-900 dark:text-white" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700" {...props} />
          ),
          // Customize horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="border-gray-300 dark:border-gray-600 my-6" {...props} />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
