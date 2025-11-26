import { use } from 'react';
import { UserDetail, PageHeaderContent } from '../../../_components';
import type { PageHeaderConfig } from '../../../_providers/PageHeaderProvider';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function UserDetailPage({ params, searchParams }: UserDetailPageProps) {
  const { id } = use(params);
  const search = use(searchParams);
  
  const returnUrl = search.returnUrl 
    ? decodeURIComponent(search.returnUrl as string)
    : '/admin/users';

  const pageHeaderConfig: PageHeaderConfig = {
    title: 'User Details',
    subtitle: 'View and edit user information',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users', href: returnUrl },
      { label: 'User Details' },
    ],
    mobileTitle: 'Edit User',
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UserDetail userId={id} returnUrl={returnUrl} />
    </PageHeaderContent>
  );
}
