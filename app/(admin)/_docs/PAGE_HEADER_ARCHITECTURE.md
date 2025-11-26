# Page Header Pattern - Visual Architecture

## Component Hierarchy

```
AdminLayout
└── PageHeaderProvider (Context)
    └── AdminShell
        ├── PageHeader (reads from context) ← RENDERS HERE
        │   ├── Breadcrumbs
        │   ├── Title & Subtitle
        │   └── Action Buttons
        │
        └── {children} ← YOUR PAGE
            └── useSetPageHeader() ← DECLARES HERE
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Your Page Component                                         │
│                                                             │
│  useSetPageHeader({                                         │
│    title: "Users",                    ┌──────────────────┐ │
│    breadcrumbs: [...],                │ Calls setConfig  │ │
│    actions: [{                        └────────┬─────────┘ │
│      onClick: handleCreate ──────────────┐     │           │
│    }]                                    │     │           │
│  })                                      │     │           │
│                                          │     ▼           │
└──────────────────────────────────────────┼─────────────────┘
                                           │     │
                                           │     │
                                           │  ┌──▼────────────────┐
                                           │  │ PageHeaderContext │
                                           │  │   (React Context) │
                                           │  └──┬────────────────┘
                                           │     │
                                           │     ▼
┌──────────────────────────────────────────┼─────────────────┐
│ PageHeader Component                     │                 │
│                                          │                 │
│  const { config } = usePageHeader()      │                 │
│                                          │                 │
│  return (                                │                 │
│    <div>                                 │                 │
│      <Breadcrumbs items={config.breadcrumbs} />           │
│      <h1>{config.title}</h1>             │                 │
│      {config.actions.map(action =>       │                 │
│        <button onClick={action.onClick}>──┘                │
│          {action.label}                                    │
│        </button>                                           │
│      )}                                                    │
│    </div>                                                  │
│  )                                                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Lifecycle

```
1. Page Mounts
   │
   ├─→ useSetPageHeader() called
   │   └─→ useEffect sets config in context
   │
2. PageHeader Component
   │
   ├─→ usePageHeader() reads config
   │   └─→ Renders breadcrumbs, title, actions
   │
3. User Clicks Action Button
   │
   ├─→ onClick() callback executes
   │   └─→ Has access to page's local state/hooks
   │
4. Page Unmounts
   │
   └─→ useSetPageHeader() cleanup
       └─→ setConfig(null) clears header
```

## Mobile vs Desktop Rendering

```
MOBILE LAYOUT:
┌────────────────────────────────┐
│ Header (Avatar, etc)           │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ PageHeader                 │ │
│ │  • Breadcrumbs (collapsed) │ │
│ │  • Action buttons (icons)  │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │ Page Content               │ │
│ │                            │ │
│ └────────────────────────────┘ │
├────────────────────────────────┤
│ Bottom Navigation              │
└────────────────────────────────┘

DESKTOP LAYOUT:
┌────────┬────────────────────────────────┐
│        │ ┌────────────────────────────┐ │
│        │ │ PageHeader                 │ │
│ Side   │ │  • Breadcrumbs (full)      │ │
│ bar    │ │  • Title & Subtitle        │ │
│        │ │  • Action buttons (labels) │ │
│ Nav    │ └────────────────────────────┘ │
│        │ ┌────────────────────────────┐ │
│        │ │                            │ │
│        │ │ Page Content               │ │
│        │ │                            │ │
│        │ └────────────────────────────┘ │
└────────┴────────────────────────────────┘
```

## Example: User Management Page Flow

```
┌─────────────────────────────────────────────────────────────┐
│ /admin/users/page.tsx                                       │
│                                                             │
│  function UsersPage() {                                     │
│    const router = useRouter()                               │
│    const { showSuccess } = useNotifications()               │
│                                                             │
│    const handleCreate = () => {                             │
│      router.push('/admin/users/new')                        │
│    }                                                        │
│                                                             │
│    useSetPageHeader({                                       │
│      title: "User Management",         ──────┐             │
│      breadcrumbs: [                          │             │
│        { label: "Admin", href: "/admin" },   │             │
│        { label: "Users" }                    │             │
│      ],                                      │             │
│      actions: [{                             │             │
│        label: "Create User",                 │             │
│        onClick: handleCreate ────────┐       │             │
│      }]                              │       │             │
│    })                                │       │             │
│                                      │       │             │
│    return <UserList />               │       │             │
│  }                                   │       │             │
└──────────────────────────────────────┼───────┼─────────────┘
                                       │       │
                                       │       ▼
                            ┌──────────┼────────────────────┐
                            │ Context  │                    │
                            │  Stores  ▼                    │
                            │  {                            │
                            │    title: "User Management",  │
                            │    breadcrumbs: [...],        │
                            │    actions: [{                │
                            │      onClick: handleCreate ───┤
                            │    }]                         │
                            │  }                            │
                            └──────────┬────────────────────┘
                                       │
                                       ▼
┌───────────────────────────────────────────────────────────┐
│ PageHeader Component (in AdminShell)                      │
│                                                           │
│  const { config } = usePageHeader()                       │
│                                                           │
│  <nav>                                                    │
│    <Breadcrumb items={config.breadcrumbs} />             │
│  </nav>                                                   │
│                                                           │
│  <h1>{config.title}</h1>                                  │
│  ↓ "User Management"                                      │
│                                                           │
│  <button onClick={config.actions[0].onClick}>            │
│    {config.actions[0].label}                             │
│  </button>                                               │
│  ↓ "Create User" (when clicked, runs handleCreate) ──────┤
│                                                           │
└───────────────────────────────────────────────────────────┘
                                                           │
                                User Sees:                 │
                                                           │
    ┌──────────────────────────────────────────────┐      │
    │ Admin > Users                    [Create User]│      │
    │                                               │      │
    │ User Management                               │      │
    │                                               │      │
    │ [User List Table]                             │      │
    └───────────────────────────────────────────────┘      │
                                                           │
                            User clicks "Create User" ─────┘
                                    │
                                    ▼
                            handleCreate() executes
                                    │
                                    ▼
                            router.push('/admin/users/new')
```

## Key Advantages

1. **Separation of Concerns**
   - Page declares WHAT it needs
   - Layout decides WHERE/HOW to render

2. **Context Access**
   - Actions run in page component scope
   - Full access to hooks, state, callbacks

3. **Consistency**
   - Same rendering location every time
   - Same styling across all pages

4. **Flexibility**
   - Each page can have different content
   - Dynamic updates based on state

5. **Maintainability**
   - Change header layout once, affects all pages
   - Type-safe configuration
