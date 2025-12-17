'use client';

import { useState, useEffect, useRef } from 'react';
import { UpdateType, UpdateStatus } from '@prisma/client';
import { useMobileDetection } from '@/src/hooks';
import type { UpdateFormProps, UpdateFormData } from './UpdateForm.types';
import { FaCalendarAlt, FaBullhorn, FaComments, FaFileAlt, FaNewspaper, FaStar, FaClock, FaTags } from 'react-icons/fa';

// Type icon mapping
const TYPE_ICONS: Record<UpdateType, React.ComponentType<any>> = {
  CASE_STUDY: FaFileAlt,
  DISCUSSION: FaComments,
  EVENT: FaCalendarAlt,
  NEWS: FaNewspaper,
  ANNOUNCEMENT: FaBullhorn,
};

// Type labels and descriptions
const TYPE_INFO: Record<UpdateType, { label: string; description: string }> = {
  NEWS: {
    label: 'News',
    description: 'Latest news and press releases',
  },
  CASE_STUDY: {
    label: 'Case Study',
    description: 'In-depth analysis or real-world examples',
  },
  DISCUSSION: {
    label: 'Discussion',
    description: 'Community discussions and Q&A',
  },
  EVENT: {
    label: 'Event',
    description: 'Upcoming events and webinars',
  },
  ANNOUNCEMENT: {
    label: 'Announcement',
    description: 'Important announcements and notices',
  },
};

export function UpdateForm({ 
  mode, 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: UpdateFormProps) {
  const { isMobile } = useMobileDetection();
  const topRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState<UpdateFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    type: initialData?.type || 'NEWS',
    status: initialData?.status || 'DRAFT',
    featured: initialData?.featured || false,
    tags: initialData?.tags || [],
    eventDate: initialData?.eventDate || null,
    expiresAt: initialData?.expiresAt || null,
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateFormData, string>>>({});

  // Wizard state (for create mode)
  const [showTypeSelection, setShowTypeSelection] = useState(mode === 'create' && !initialData);
  const [hasSelectedType, setHasSelectedType] = useState(mode === 'edit' || !!initialData);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.type === 'EVENT' && !formData.eventDate) {
      newErrors.eventDate = 'Event date is required for events';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleFieldChange = (field: keyof UpdateFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      handleFieldChange('tags', [...formData.tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleFieldChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleTypeSelection = (type: UpdateType) => {
    handleFieldChange('type', type);
    setShowTypeSelection(false);
    setHasSelectedType(true);
    
    // Scroll to top after selecting type - wait for paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  const handleNextFromTypeSelection = () => {
    if (hasSelectedType) {
      setShowTypeSelection(false);
      // Give time for render to complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  };

  const handleBackToTypeSelection = () => {
    setShowTypeSelection(true);
    // Give time for render to complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  // Type selection screen
  if (showTypeSelection) {
    return (
      <div ref={topRef} className="max-w-4xl mx-auto p-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Choose Type</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${hasSelectedType ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'} rounded-full flex items-center justify-center font-semibold`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${hasSelectedType ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>Create Content</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose Update Type
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Select the type of update you want to create
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.entries(TYPE_INFO) as [UpdateType, typeof TYPE_INFO[UpdateType]][]).map(([type, info]) => {
            const Icon = TYPE_ICONS[type];
            const isSelected = formData.type === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeSelection(type)}
                className={`p-6 bg-white dark:bg-gray-800 border-2 rounded-lg hover:shadow-lg transition-all text-left group ${
                  isSelected 
                    ? 'border-blue-500 dark:border-blue-500 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                  isSelected 
                    ? 'bg-blue-600 dark:bg-blue-600' 
                    : 'bg-blue-100 dark:bg-blue-900'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {info.label}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {info.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          {hasSelectedType && (
            <button
              type="button"
              onClick={handleNextFromTypeSelection}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Next: Create Content →
            </button>
          )}
        </div>
      </div>
    );
  }

  // Form screen
  const TypeIcon = TYPE_ICONS[formData.type];
  const typeInfo = TYPE_INFO[formData.type];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div ref={topRef} />
      {/* Progress indicator for create mode */}
      {mode === 'create' && (
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Choose Type</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">Create Content</span>
            </div>
          </div>
        </div>
      )}

      {/* Type Badge */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
          <TypeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">{typeInfo.label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{typeInfo.description}</p>
        </div>
        {mode === 'create' && (
          <button
            type="button"
            onClick={handleBackToTypeSelection}
            className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
          >
            Change Type
          </button>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter update title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          rows={2}
          className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Brief summary of the update"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          rows={12}
          className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border ${
            errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm`}
          placeholder="Full content (supports Markdown)"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
        )}
      </div>

      {/* Type-specific fields */}
      {formData.type === 'EVENT' && (
        <div>
          <label htmlFor="eventDate" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaCalendarAlt className="w-4 h-4" />
            Event Date *
          </label>
          <input
            id="eventDate"
            type="datetime-local"
            value={formData.eventDate || ''}
            onChange={(e) => handleFieldChange('eventDate', e.target.value || null)}
            className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border ${
              errors.eventDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.eventDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.eventDate}</p>
          )}
        </div>
      )}

      {formData.type === 'ANNOUNCEMENT' && (
        <div>
          <label htmlFor="expiresAt" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FaClock className="w-4 h-4" />
            Expires At (Optional)
          </label>
          <input
            id="expiresAt"
            type="datetime-local"
            value={formData.expiresAt || ''}
            onChange={(e) => handleFieldChange('expiresAt', e.target.value || null)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Announcement will be hidden after this date
          </p>
        </div>
      )}

      {/* Tags */}
      <div>
        <label htmlFor="tagInput" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FaTags className="w-4 h-4" />
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="tagInput"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                  aria-label={`Remove ${tag}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Publishing Options */}
      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white">Publishing Options</h3>
        
        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleFieldChange('status', e.target.value as UpdateStatus)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => handleFieldChange('featured', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FaStar className="w-4 h-4 text-yellow-500" />
            Featured
            <span className="text-xs text-gray-500 dark:text-gray-400">(Display prominently)</span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          {mode === 'create' && (
            <button
              type="button"
              onClick={handleBackToTypeSelection}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {mode === 'create' ? 'Create Update' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
