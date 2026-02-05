'use client';
import CompanyDetails from '@/components/company/companydetails';
import { useSWRFetch } from '@/components/config/useswrfetch';
import { useParams } from 'next/navigation';

export default function Company() {
  const params = useParams();
  const id = params?.id;
  const { data, error, isLoading } = useSWRFetch(id ? `/api/users?id=${id}` : null);
  const nodata = !data || !data?._id || error || data?.error
  return <CompanyDetails userData={data} isLoading={isLoading} error={nodata} userId={id} />;
}
