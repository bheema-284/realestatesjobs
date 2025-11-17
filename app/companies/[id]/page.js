'use client';
import CompanyDetails from '@/components/company/companydetails';
import { useSWRFetch } from '@/components/config/useswrfetch';
import { useParams } from 'next/navigation';

export default function Company() {
  const params = useParams();
  const id = params?.id;
  const { data, error, isLoading } = useSWRFetch(id ? `/api/users?id=${id}` : null);
  return <CompanyDetails userData={data} userId={id} />;
}
