'use client';

import { useSetPageHeader } from '../../_providers/PageHeaderProvider';
import type { PageHeaderConfig } from '../../_providers/PageHeaderProvider';

interface PageHeaderContentProps {
  config: PageHeaderConfig;
  children: React.ReactNode;
}

/**
 * PageHeaderContent Component
 * 
 * Client-side wrapper that sets page header configuration and renders children.
 * Use this to keep your pages as Server Components while still utilizing the
 * page header teleportation pattern.
 * 
 * @example
 * ```tsx
 * export default function MyPage() {
 *   const pageHeaderConfig = {
 *     title: 'My Page',
 *     breadcrumbs: [...]
 *   };
 * 
 *   return (
 *     <PageHeaderContent config={pageHeaderConfig}>
 *       <MyContent />
 *     </PageHeaderContent>
 *   );
 * }
 * ```
 */
export function PageHeaderContent({ config, children }: PageHeaderContentProps) {
  useSetPageHeader(config);
  
  return <>{children}</>;
}
