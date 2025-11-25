import { UserDetail, Breadcrumb } from '../../../_components';

export default function NewUserPage() {
  return (
    <div className="p-4 md:p-8">
      <Breadcrumb
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'New User' },
        ]}
        mobileTitle="Create User"
        className="mb-6"
      />
      <UserDetail />
    </div>
  );
}
