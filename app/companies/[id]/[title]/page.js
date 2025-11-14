"use client";
import { useParams } from "next/navigation";
import ProjectDetailsPage from "@/components/company/projectdetails";
import { useSWRFetch } from "@/components/config/useswrfetch";
import Loading from "@/components/common/loading";
export default function ProjectDetails() {
  const { id, title } = useParams();

  // Only fetch data if we have a companyID and we're on the client
  const { data, error, isLoading } = useSWRFetch(`/api/companies`);
  const comanydata = data || [];
  const companyProfile = comanydata.find(
    (c) => c._id.toString() === id
  );

  const project = companyProfile?.projects.find(
    (p) => encodeURIComponent(p.id) === title
  );
  { isLoading && <Loading /> }
  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Project not found
      </div>
    );
  }

  return (
    <ProjectDetailsPage />
  );
}
