import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Computer Vision Lab | Javier Siliacay",
  description:
    "Interactive real-time computer vision demo featuring hand pose, face landmarks, and pose detection built by Javier Siliacay.",
  alternates: {
    canonical: "/vision",
  },
};

export default function VisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
