"use client";
import { useParams } from "next/navigation";
import Slider from "../common/slider";
import { companyData } from '../config/data'
import { useEffect, useState } from "react";
export default function ProjectDetailsPage() {
    const { id, title } = useParams();
    const [project, setProject] = useState({});
    const company = companyData.find((c) => String(c.id) === String(id || 1));

    useEffect(() => {
        const data = company?.projects.find((c) => String(c.title) === String(title || ""));
        if (data) {
            setProject(data);
        }
    }, [id]);
    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <Slider data={company.projects} imageSize={"400px"} />
            {/* Example placeholder */}

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold">Location</h3>
                    <p>Pallavaram-Thuraipakkam Rd, Chennai</p>
                </div>
                <div>
                    <h3 className="font-semibold">Price</h3>
                    <p>₹ 1.2* Crore onwards</p>
                </div>
                <div>
                    <h3 className="font-semibold">Project Type</h3>
                    <p>Apartment</p>
                </div>
                <div>
                    <h3 className="font-semibold">Total Units</h3>
                    <p>2069 Units</p>
                </div>
            </div>
        </div>
    );
}
