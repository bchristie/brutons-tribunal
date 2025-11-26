import { use } from 'react';
import { UserDetail, Breadcrumb } from '../../../_components';

interface NewUserPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function NewUserPage({ searchParams }: NewUserPageProps) {
  const search = use(searchParams);
  
  // Build return URL with original search params
  const returnUrl = search.returnUrl 
    ? decodeURIComponent(search.returnUrl as string)
    : '/admin/users';

  return (
    <div className="p-4 md:p-8">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: returnUrl },
          { label: 'New User' },
        ]}
        mobileTitle="Create User"
        className="mb-6"
      />
      <UserDetail returnUrl={returnUrl} />
    </div>
  );
}
