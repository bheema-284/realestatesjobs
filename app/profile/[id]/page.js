'use client';

import { useParams } from 'next/navigation';
import ProfilePage from '@/components/candidates';

export default function Profile() {
  const params = useParams();
  const id = params?.id;

  return <ProfilePage userId={id} />;
}
