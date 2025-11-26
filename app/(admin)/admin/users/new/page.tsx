import { use } from 'react';
import { UserDetail, PageHeaderContent } from '../../../_components';
import type { PageHeaderConfig } from '../../../_providers/PageHeaderProvider';

interface NewUserPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function NewUserPage({ searchParams }: NewUserPageProps) {
  const search = use(searchParams);
  
  const returnUrl = search.returnUrl 
    ? decodeURIComponent(search.returnUrl as string)
    : '/admin/users';

  const pageHeaderConfig: PageHeaderConfig = {
    title: 'Create New User',
    subtitle: 'Add a new user to the system',
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users', href: returnUrl },
      { label: 'New User' },
    ],
    mobileTitle: 'Create User',
  };

  return (
    <PageHeaderContent config={pageHeaderConfig}>
      <UserDetail returnUrl={returnUrl} />
    </PageHeaderContent>
  );
}
