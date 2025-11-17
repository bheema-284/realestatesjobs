"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddRecruiterForm from "@/components/company/addrecruiter";
import { Mutated, useSWRFetch } from "@/components/config/useswrfetch";

export default function Page() {
    const router = useRouter();
    const [companyID, setCompanyID] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Get user details from localStorage on client side only
        const user_details = JSON.parse(localStorage.getItem('user_details') || '{}');
        setCompanyID(user_details.id || null);
    }, []);

    // Only fetch data if we have a companyID and we're on the client
    const { data, error, isLoading } = useSWRFetch(`/api/companies`);
    const mutated = Mutated(companyID ? `/api/employees?companyId=${companyID}` : null);
    // Handle loading state
    if (!isClient || isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">Error loading company data</div>
            </div>
        );
    }

    // Handle case where companyID is not available
    if (!companyID) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-red-500 text-lg">Company not found. Please log in.</div>
            </div>
        );
    }
    return <AddRecruiterForm
        companyId={companyID}
        onClose={() => { router.back() }}
        existingProjects={data?.company?.projects || []}
        mutated={mutated}
    />
}