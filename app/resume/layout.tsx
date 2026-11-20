import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Javier Siliacay",
  description:
    "Professional experience, education, technical skills, and certifications of Javier Siliacay — Software Developer & AI Engineer.",
  alternates: {
    canonical: "/resume",
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
