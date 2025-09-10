'use client';
import CompanyDetails from '@/components/company/companydetails';
import { useParams } from 'next/navigation';

export default function Company() {
  const params = useParams();
  const id = params?.id;

  return <CompanyDetails userId={id} />;
}
