import JobsList from "@/components/jobs/jobslist";
export const runtime = "edge";

export default async function Page() {
    return <JobsList />;
}
