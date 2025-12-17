'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UpdateType, UpdateStatus } from '@prisma/client';
import { useAdminApi } from '../../_providers';
import { useNotifications } from '../../_providers';
import { useMobileDetection } from '@/src/hooks';
import type { Update } from '../../_providers/AdminApiProvider';
import type { UpdateListProps, UpdateListFilters } from './UpdateList.types';
import { FaSearch, FaCalendarAlt, FaBullhorn, FaComments, FaFileAlt, FaNewspaper, FaStar, FaCaretUp, FaCaretDown, FaSort } from 'react-icons/fa';

// Type icon mapping
const TYPE_ICONS: Record<UpdateType, React.ComponentType<any>> = {
  CASE_STUDY: FaFileAlt,
  DISCUSSION: FaComments,
  EVENT: FaCalendarAlt,
  NEWS: FaNewspaper,
  ANNOUNCEMENT: FaBullhorn,
};

// Type label mapping
const TYPE_LABELS: Record<UpdateType, string> = {
  CASE_STUDY: 'Case Study',
  DISCUSSION: 'Discussion',
  EVENT: 'Event',
  NEWS: 'News',
  ANNOUNCEMENT: 'Announcement',
};

// Status color mapping
const STATUS_COLORS: Record<UpdateStatus, string> = {
  DRAFT: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  PUBLISHED: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  ARCHIVED: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
};

export function UpdateList({ 
  className = '', 
  initialFilters = {},
  onFilterChange 
}: UpdateListProps) {
  const router = useRouter();
  const { updates, fetchUpdates, deleteUpdate, isLoading } = useAdminApi();
  const { success, error: showError } = useNotifications();
  const { isMobile } = useMobileDetection();
  
  const defaultLimit = 20;
  const [search, setSearch] = useState(initialFilters.search || '');
  const [selectedTypes, setSelectedTypes] = useState<UpdateType[]>(initialFilters.types || []);
  const [selectedStatuses, setSelectedStatuses] = useState<UpdateStatus[]>(initialFilters.statuses || []);
  const [sortColumn, setSortColumn] = useState<'title' | 'status' | 'published' | 'author'>('published');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Update | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const limit = initialFilters.limit || defaultLimit;

  // Convert column sort to API format
  const getSortParam = (): 'newest' | 'oldest' | 'title' | 'published' => {
    if (sortColumn === 'title') return 'title';
    if (sortColumn === 'published') return sortDirection === 'desc' ? 'published' : 'oldest';
    // For status and author, use published as default (will sort client-side)
    return sortDirection === 'desc' ? 'published' : 'oldest';
  };

  // Notify parent of filter changes
  const notifyFilterChange = (newFilters: Partial<UpdateListFilters>) => {
    const filters: UpdateListFilters = {
      search,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      sort: getSortParam(),
      page: currentPage,
      limit,
      ...newFilters,
    };
    onFilterChange?.(filters);
  };

  // Fetch updates on mount (provider checks staleness)
  useEffect(() => {
    fetchUpdates({ 
      page: currentPage, 
      limit, 
      search,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      sort: getSortParam(),
    });
  }, []);

  // Fetch when filters change
  useEffect(() => {
    const newPage = 1;
    setCurrentPage(newPage);
    notifyFilterChange({ page: newPage });
    fetchUpdates({ 
      page: newPage, 
      limit, 
      search,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      sort: getSortParam(),
    });
  }, [search, selectedTypes, selectedStatuses, sortColumn, sortDirection]);

  // Fetch when page changes
  useEffect(() => {
    notifyFilterChange({ page: currentPage });
    fetchUpdates({ 
      page: currentPage, 
      limit, 
      search,
      types: selectedTypes.length > 0 ? selectedTypes : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      sort: getSortParam(),
    });
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the refetch
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleTypeToggle = (type: UpdateType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleStatusToggle = (status: UpdateStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSortColumn('published');
    setSortDirection('desc');
  };

  const handleColumnSort = (column: 'title' | 'status' | 'published' | 'author') => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column - default to desc except for title
      setSortColumn(column);
      setSortDirection(column === 'title' ? 'asc' : 'desc');
    }
  };

  const handleEdit = (update: Update) => {
    // Build current URL with filters to use as return URL
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
    if (selectedStatuses.length > 0) params.set('statuses', selectedStatuses.join(','));
    const sortParam = getSortParam();
    if (sortParam !== 'newest') params.set('sort', sortParam);
    if (currentPage > 1) params.set('page', currentPage.toString());
    const returnUrl = `/admin/updates${params.toString() ? `?${params.toString()}` : ''}`;
    
    router.push(`/admin/updates/${update.id}?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, update: Update) => {
    e.stopPropagation();
    setShowDeleteConfirm(update);
  };

  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;

    try {
      await deleteUpdate(showDeleteConfirm.id, showDeleteConfirm.updatedAt);
      setShowDeleteConfirm(null);
      success('Update deleted successfully');
      // Refetch current page
      fetchUpdates({ 
        page: currentPage, 
        limit, 
        search,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        sort: getSortParam(),
      });
    } catch (error: any) {
      showError(error?.message || 'Failed to delete update');
      console.error('Failed to delete update:', error);
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(null);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (isLoading && !updates) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pagination = updates?.pagination;
  let updatesList = updates?.updates || [];

  // Client-side sorting for status and author columns
  if (sortColumn === 'status' || sortColumn === 'author') {
    updatesList = [...updatesList].sort((a, b) => {
      let comparison = 0;
      
      if (sortColumn === 'status') {
        const statusOrder = { DRAFT: 0, PUBLISHED: 1, ARCHIVED: 2 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
      } else if (sortColumn === 'author') {
        const aAuthor = a.author?.name || '';
        const bAuthor = b.author?.name || '';
        comparison = aAuthor.localeCompare(bAuthor);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedStatuses.length > 0 || search !== '';

  return (
    <div className={className}>
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search updates by title or content..."
            className="w-full px-4 py-3 pl-12 pr-28 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="button"
            onClick={handleClearSearch}
            className={`absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${
              search ? 'visible' : 'invisible'
            }`}
            aria-label="Clear search"
          >
            ✕
          </button>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              hasActiveFilters
                ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            Filters {hasActiveFilters && `(${selectedTypes.length + selectedStatuses.length})`}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg space-y-4">
            {/* Type Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TYPE_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type as UpdateType)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedTypes.includes(type as UpdateType)
                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as UpdateStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                      selectedStatuses.includes(status)
                        ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {updatesList.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {hasActiveFilters ? 'No updates match your filters' : 'No updates found'}
          </p>
        </div>
      )}

      {/* Update List - Mobile */}
      {isMobile && updatesList.length > 0 && (
        <div className="space-y-2">
          {updatesList.map((update) => {
            const TypeIcon = TYPE_ICONS[update.type];
            return (
              <button
                key={update.id}
                onClick={() => handleEdit(update)}
                className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {update.featured && (
                        <FaStar className="w-3 h-3 text-yellow-500" />
                      )}
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {update.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                      {update.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[update.status]}`}>
                        {update.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {TYPE_LABELS[update.type]}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(update.publishedAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(e, update)}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    aria-label="Delete update"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Update List - Desktop Table */}
      {!isMobile && updatesList.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">
                  <button
                    onClick={() => handleColumnSort('title')}
                    className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Update
                    {sortColumn === 'title' ? (
                      sortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />
                    ) : (
                      <FaSort className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleColumnSort('status')}
                    className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Status
                    {sortColumn === 'status' ? (
                      sortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />
                    ) : (
                      <FaSort className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleColumnSort('published')}
                    className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Published
                    {sortColumn === 'published' ? (
                      sortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />
                    ) : (
                      <FaSort className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <button
                    onClick={() => handleColumnSort('author')}
                    className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    Author
                    {sortColumn === 'author' ? (
                      sortDirection === 'asc' ? <FaCaretUp /> : <FaCaretDown />
                    ) : (
                      <FaSort className="opacity-50" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {updatesList.map((update) => {
                const TypeIcon = TYPE_ICONS[update.type];
                return (
                  <tr 
                    key={update.id} 
                    onClick={() => handleEdit(update)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center"
                          title={TYPE_LABELS[update.type]}
                        >
                          <TypeIcon 
                            className="w-5 h-5 text-blue-600 dark:text-blue-400" 
                            aria-label={TYPE_LABELS[update.type]}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {update.featured && (
                              <FaStar className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                            )}
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {update.title}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {update.description || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[update.status]}`}>
                        {update.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(update.publishedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {update.author?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={(e) => handleDeleteClick(e, update)}
                        className="inline-flex items-center px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        aria-label="Delete update"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} updates
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Delete Update
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete &quot;{showDeleteConfirm.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
