'use client';

import { useMobileDetection } from '@/src/hooks';
import { Breadcrumb } from '../Breadcrumb';
import { usePageHeader } from '../../_providers/PageHeaderProvider';
import type { PageAction } from '../../_providers/PageHeaderProvider';

function ActionButton({ action, isMobile }: { action: PageAction; isMobile: boolean }) {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const variant = action.variant || 'primary';
  const label = isMobile && action.mobileLabel ? action.mobileLabel : action.label;

  return (
    <button
      onClick={action.onClick}
      disabled={action.disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      {action.icon}
      <span className={isMobile && action.mobileLabel ? '' : 'hidden sm:inline'}>{label}</span>
      {isMobile && action.mobileLabel && <span className="sm:hidden">{action.mobileLabel}</span>}
    </button>
  );
}

export function PageHeader() {
  const { config } = usePageHeader();
  const { isMobile } = useMobileDetection();

  if (!config) return null;

  return (
    <div className="mb-6">
      {/* Breadcrumbs & Actions Row */}
      {(config.breadcrumbs || config.actions) && (
        <div className={`flex items-center justify-between ${isMobile ? "mb-0" : "mb-4"}`}>
          {config.breadcrumbs && (
            <Breadcrumb
              items={config.breadcrumbs}
              mobileTitle={config.mobileTitle || config.title}
            />
          )}
          {config.actions && config.actions.length > 0 && (
            <div className="flex items-center gap-2">
              {config.actions.map((action, index) => (
                <ActionButton key={index} action={action} isMobile={isMobile} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Title & Subtitle (when breadcrumbs exist) */}
      {config.breadcrumbs && config.subtitle && (
        <div className={isMobile ? "mb-0" : "mb-6"}>
          <p className="text-gray-600 dark:text-gray-400">{config.subtitle}</p>
        </div>
      )}

      {/* Title & Subtitle (when no breadcrumbs) */}
      {!config.breadcrumbs && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h1>
          {config.subtitle && (
            <p className="text-gray-600 dark:text-gray-400">{config.subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
