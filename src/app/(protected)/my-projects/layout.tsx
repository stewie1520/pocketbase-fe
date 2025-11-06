import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Projects",
  description: "My Projects",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}