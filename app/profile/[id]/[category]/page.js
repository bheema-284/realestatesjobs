'use client';

import { useParams } from 'next/navigation';
import ProfilePage from '@/components/candidates/candidates';

export default function Profile() {
  const params = useParams();
  const { id, category } = params;
  const { data, error, isLoading } = useSWRFetch(id ? `/api/users?id=${id}` : null);
  return <ProfilePage userId={id} category={category} userData={data} />;
}
