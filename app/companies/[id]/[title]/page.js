"use client";
import { useParams } from "next/navigation";
import { companyData } from '../../../../components/config/data'
import ProjectDetailsPage from "@/components/company/projectdetails";
export default function ProjectDetails() {
  const { id, title } = useParams();
  const companyProfile = companyData.find(
    (c) => c.id.toString() === id
  );

  const project = companyProfile?.projects.find(
    (p) => encodeURIComponent(p.title) === title
  );

  if (!companyProfile || !project) {
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
