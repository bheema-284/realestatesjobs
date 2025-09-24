'use client';

import { useParams } from 'next/navigation';
import ProfilePage from '@/components/candidates/candidates';

export default function Profile() {
  const params = useParams();
  const { id, category } = params;
  return <ProfilePage userId={id} category={category} />;
}
