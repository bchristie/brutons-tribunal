# Page Header Pattern - Usage Guide

## Overview

The **Page Header Provider Pattern** (aka "Teleportation Pattern") allows pages to declaratively define their header content (title, breadcrumbs, action buttons) which is then rendered consistently in the layout. This keeps pages simple while ensuring consistent header positioning and styling.

## Benefits

1. **Pages stay simple** - Just declare what you need via `useSetPageHeader()`
2. **Consistent positioning** - Header always renders in the same place
3. **Full context access** - Pages can pass callbacks with access to local state/hooks
4. **Type-safe** - TypeScript ensures correct usage
5. **Mobile-responsive** - Layout handles mobile/desktop differences
6. **Automatic cleanup** - Header config removed when page unmounts

## Architecture

```
┌─────────────────────────────────────────────┐
│ Layout (AdminShell)                         │
│  ┌────────────────────────────────────┐    │
│  │ PageHeader Component               │    │
│  │  - Reads from PageHeaderProvider   │    │
│  │  - Renders breadcrumbs, title,     │    │
│  │    subtitle, action buttons        │    │
│  └────────────────────────────────────┘    │
│  ┌────────────────────────────────────┐    │
│  │ {children} - Your Page Content     │    │
│  │  - Calls useSetPageHeader()        │    │
│  │  - Declares header config          │    │
│  └────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

## Basic Usage

### Recommended Pattern: PageHeaderContent Wrapper

The best approach is to use the `PageHeaderContent` wrapper component. This allows you to keep pages as Server Components while utilizing the page header pattern.

```tsx
import { PageHeaderContent } from '../../_components';
import type { PageHeaderConfig } from '../../_providers/PageHeaderProvider';

export default function MyPage() {
  const pageHeaderConfig: PageHeaderConfig = {
    title: 'My Page',
    subtitle: 'Page description',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'My Page' },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <MyContent />
    </PageHeaderContent>
  );
}
```

### Alternative Pattern: Direct Hook Usage (Client Components Only)

If your page is already a Client Component, you can use `useSetPageHeader` directly:

```tsx
'use client';

import { useSetPageHeader } from '../../_providers/PageHeaderProvider';

export default function MyPage() {
  useSetPageHeader({
    title: 'My Page',
    subtitle: 'Page description',
  });

  return <MyContent />;
}
```

### 1. Simple Page with Title Only

```tsx
import { PageHeaderContent } from '../../_components';

export default function DashboardPage() {
  const pageHeaderConfig = {
    title: 'Dashboard',
    subtitle: 'Overview of your administrative tasks',
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      {/* Your page content */}
    </PageHeaderContent>
  );
}
```

### 2. Page with Breadcrumbs

```tsx
import { PageHeaderContent } from '../../_components';

export default function SettingsPage() {
  const pageHeaderConfig = {
    title: 'Settings',
    subtitle: 'Configure system preferences',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Settings' },
    ],
    mobileTitle: 'Settings', // Shorter title for mobile breadcrumb
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      {/* Your page content */}
    </PageHeaderContent>
  );
}
```

### 3. Page with Action Buttons (Client Component)

For pages with interactive actions, you'll need a Client Component to handle callbacks:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { PageHeaderContent } from '../../_components';
import { FaPlus, FaFileExport } from 'react-icons/fa';

export default function UsersPage() {
  const router = useRouter();

  const handleCreateUser = () => {
    router.push('/admin/users/new');
  };

  const handleExport = () => {
    // Export logic
    console.log('Exporting users...');
  };

  const pageHeaderConfig = {
    title: 'User Management',
    subtitle: 'Manage user accounts and permissions',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users' },
    ],
    mobileTitle: 'Users',
    actions: [
      {
        label: 'Export',
        mobileLabel: 'Export', // Can be same or different
        onClick: handleExport,
        icon: <FaFileExport />,
        variant: 'secondary' as const, // 'primary' | 'secondary' | 'danger'
      },
      {
        label: 'Create User',
        mobileLabel: 'New', // Shorter for mobile
        onClick: handleCreateUser,
        icon: <FaPlus />,
        variant: 'primary' as const,
      },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      {/* Your page content */}
    </PageHeaderContent>
  );
}
```

### 4. Server Component with Dynamic Data

For pages that remain as Server Components but need dynamic data (like params):

```tsx
import { PageHeaderContent } from '../../_components';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnUrl?: string }>;
}

export default async function UserDetailPage({ params, searchParams }: UserDetailPageProps) {
  const { id } = await params;
  const search = await searchParams;
  
  const returnUrl = search.returnUrl 
    ? decodeURIComponent(search.returnUrl as string)
    : '/admin/users';

  const pageHeaderConfig = {
    title: 'User Details',
    subtitle: 'View and edit user information',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users', href: returnUrl },
      { label: 'Details' },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UserDetailForm userId={id} returnUrl={returnUrl} />
    </PageHeaderContent>
  );
}
```

```tsx
'use client';

import { useState } from 'react';
import { useSetPageHeader } from '../../_providers/PageHeaderProvider';
import { FaSave } from 'react-icons/fa';

export default function EditPage() {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Save logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsDirty(false);
  };

  const pageHeaderConfig = {
    title: 'Edit Settings',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Settings', href: '/admin/settings' },
      { label: 'Edit' },
    ],
    actions: [
      {
        label: isSaving ? 'Saving...' : 'Save Changes',
        onClick: handleSave,
        icon: <FaSave />,
        variant: 'primary' as const,
        disabled: !isDirty || isSaving, // Disable when clean or saving
      },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <div>
        <input 
          type="text" 
          onChange={() => setIsDirty(true)}
          placeholder="Change something..."
        />
      </div>
    </PageHeaderContent>
  );
}
```

### 5. Page with Context from API/Hooks

```tsx
'use client';

import { useSetPageHeader } from '../../_providers/PageHeaderProvider';
import { useAdminApi, useNotifications } from '../../_providers';
import { FaTrash } from 'react-icons/fa';

export default function UserDetailPage({ userId }: { userId: string }) {
  const { deleteUser } = useAdminApi();
  const { showSuccess, showError } = useNotifications();

  const handleDelete = async () => {
    if (!confirm('Are you sure?')) return;
    
    try {
      await deleteUser(userId);
      showSuccess('User deleted successfully');
      // Navigate away...
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  const pageHeaderConfig = {
    title: 'User Details',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users', href: '/admin/users' },
      { label: 'Details' },
    ],
    actions: [
      {
        label: 'Delete User',
        onClick: handleDelete,
        icon: <FaTrash />,
        variant: 'danger' as const, // Red styling
      },
    ],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <div>
        {/* User details */}
      </div>
    </PageHeaderContent>
  );
}
```

## TypeScript Types

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  mobileLabel?: string; // Shorter label for mobile
}

interface PageHeaderConfig {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  mobileTitle?: string; // Simplified title for mobile breadcrumb
  actions?: PageAction[];
}
```

## Best Practices

### 1. Call useSetPageHeader Early
Place it near the top of your component, before conditional returns:

```tsx
function MyPage() {
  useSetPageHeader({ /* config */ });
  
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  return <div>Content</div>;
}
```

### 2. Use Callbacks for Actions with Context
Actions have access to component state/hooks:

```tsx
const { mutate } = useSomeHook();
const [data, setData] = useState();

useSetPageHeader({
  actions: [{
    label: 'Do Something',
    onClick: () => mutate(data), // Has access to local state
  }],
});
```

### 3. Mobile-Friendly Labels
Provide shorter labels for mobile when needed:

```tsx
actions: [{
  label: 'Create New User',
  mobileLabel: 'New',  // Much shorter
  onClick: handleCreate,
}]
```

### 4. Conditional Actions
Hide actions based on state:

```tsx
const actions = [];

if (canEdit) {
  actions.push({
    label: 'Edit',
    onClick: handleEdit,
  });
}

if (canDelete) {
  actions.push({
    label: 'Delete',
    onClick: handleDelete,
    variant: 'danger',
  });
}

useSetPageHeader({ title: 'Page', actions });
```

### 5. Dynamic Content
Header updates when dependencies change:

```tsx
const [title, setTitle] = useState('Initial');

useSetPageHeader({ 
  title, // Updates when title changes
});
```

## Migration Example

### Before (Old Pattern)
```tsx
export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={[...]} />
        <button onClick={handleCreate}>Create</button>
      </div>
      <h1>User Management</h1>
      <p>Subtitle text</p>
      <UserList />
    </div>
  );
}
```

### After (New Pattern with PageHeaderContent)
```tsx
import { PageHeaderContent } from '../../_components';

export default function UsersPage() {
  const pageHeaderConfig = {
    title: 'User Management',
    subtitle: 'Subtitle text',
    breadcrumbs: [...],
    actions: [{
      label: 'Create',
      onClick: handleCreate,
    }],
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UserList />
    </PageHeaderContent>
  );
}
```

**Note:** If your page needs interactive callbacks (like `onClick`), it must be a Client Component (`'use client'`). For static pages, you can remain as Server Components.

## Troubleshooting

### Header Not Showing
- Ensure `PageHeaderProvider` is in your layout tree
- Check that `PageHeader` component is rendered in the layout
- Verify you're calling `useSetPageHeader` (not just `usePageHeader`)

### Stale Data in Actions
- Remember: config object is evaluated once unless dependencies change
- If using dynamic data, ensure it's captured in the closure or use deps

### TypeScript Errors
- Import types from `'../../_providers/PageHeaderProvider'`
- Use `ReactNode` for icons: `icon: <FaIcon />`

## Summary

The Page Header Provider pattern gives you:
- ✅ Consistent header layout across all pages
- ✅ Clean, simple page components
- ✅ Full access to page context for actions
- ✅ Automatic mobile responsiveness
- ✅ Type-safe configuration
- ✅ Easy maintenance and updates

Just call `useSetPageHeader()` with your config, and the layout handles the rest!
