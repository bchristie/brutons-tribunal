import { UserDetail } from '../../../_components';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  return (
    <div className="p-4 md:p-8">
      <UserDetail userId={id} />
    </div>
  );
}
