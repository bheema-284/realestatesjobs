'use client';
import { useRouter } from 'next/navigation';
import { ProfilePage } from './candidates/candidates';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ProfilePage userId={id} />;
};

export default Profile;