# Admin Section

## Overview
The admin section provides a management interface for site administrators with distinct experiences for mobile and desktop users.

## Structure

```
app/(admin)/
├── _components/           # Admin-specific components
│   ├── AdminView.tsx      # Device-aware wrapper component
│   ├── MobileAdminDashboard.tsx    # Mobile-optimized interface
│   ├── DesktopAdminDashboard.tsx   # Desktop-optimized interface
│   └── index.ts           # Barrel exports
├── layout.tsx             # Admin layout with auth protection
└── admin/                 # Admin routes
    ├── page.tsx           # Main dashboard
    ├── users/             # User management
    ├── roles/             # Role & permission management
    ├── updates/           # Content updates (coming soon)
    └── settings/          # System settings (coming soon)
```

## Authentication & Authorization

- **Authentication Required**: All admin routes require a valid user session
- **Role Required**: `Roles.ADMIN` (checked at layout level)
- **Unauthorized Access**: Redirects to `/?error=unauthorized`

## Mobile vs Desktop Experience

### Mobile View
- Card-based layout for touch-friendly interaction
- Simplified navigation with large touch targets
- Essential actions only
- Optimized for smaller screens
- Stack-based information display

### Desktop View
- Sidebar navigation with persistent menu
- Detailed data tables with sorting and filtering
- Bulk action capabilities
- Multi-column layouts
- Comprehensive information display

## Device Detection

Uses the `useMobileDetection` hook to determine which interface to render:
- Detects based on screen width and user agent
- Seamless switching between views
- No page reload required

## Access the Admin Panel

Navigate to: `/admin`

## Future Enhancements

- Real-time data with actual API calls
- User CRUD operations
- Role and permission management
- Audit logs and activity tracking
- Settings management
- Bulk operations for desktop view
