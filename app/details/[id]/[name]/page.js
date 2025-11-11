'use client';

import { useParams } from 'next/navigation';
import CandidateProfilePage from "@/components/candidates/aboutcandidate";
import { useSWRFetch } from '@/components/config/useswrfetch';


export default function Profile() {
    const params = useParams();
    const { id, category } = params;
    const { data, error, isLoading } = useSWRFetch(id ? `/api/users?id=${id}` : null);
    return <CandidateProfilePage userData={data} userId={id} />;
}
