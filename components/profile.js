'use client';

import { useRouter } from 'next/router';
import { ProfilePage } from './candidates';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;

  return <ProfilePage userId={id} />;
};

export default Profile;