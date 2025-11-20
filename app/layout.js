import RootLayoutClient from "@/components/common/rootlayoutclient";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Job Portal | Find Your Next Opportunity",
  description: "Explore jobs, companies, and services for recruiters and candidates. Built with Next.js and Tailwind CSS.",
  keywords: [
    "Jobs", "Recruitment", "Hiring", "Careers", "Next.js Job Portal",
    "Real Estate Sales", "Digital Marketing", "Web Development"
  ],
  authors: [{ name: "Tech Rider" }],
  openGraph: {
    title: "Job Portal — Explore Careers & Recruit Talent",
    description: "Find top opportunities or post job listings easily.",
    url: "https://realestatejobs-delta.vercel.app",
    siteName: "Job Portal",
    images: [
      {
        url: "/dp.jpg",
        width: 1200,
        height: 630,
        alt: "Job Portal Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Portal — Find Jobs & Recruit",
    description: "Search jobs or hire top candidates.",
    images: ["/dp.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
