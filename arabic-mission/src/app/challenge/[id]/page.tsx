import { Challenge } from "@/components/Challenge";
import { missions } from "@/lib/content";
import { notFound } from "next/navigation";
export const dynamicParams = false;
export function generateStaticParams() {
  return missions.map((m) => ({ id: m.id }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!missions.some((m) => m.id === id)) notFound();
  return <Challenge id={id} />;
}
