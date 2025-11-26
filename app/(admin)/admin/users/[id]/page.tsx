import { use } from 'react';
import { UserDetail, Breadcrumb } from '../../../_components';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function UserDetailPage({ params, searchParams }: UserDetailPageProps) {
  const { id } = use(params);
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
          { label: 'User Details' },
        ]}
        mobileTitle="Edit User"
        className="mb-6"
      />
      <UserDetail userId={id} returnUrl={returnUrl} />
    </div>
  );
}
