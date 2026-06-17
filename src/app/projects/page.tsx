import ContentListPage, { makeListMetadata } from "@/components/ContentListPage";

export const generateMetadata = makeListMetadata("project");

type PageProps = {
  searchParams: Promise<{ limit?: string }>;
};

export default function Page({ searchParams }: PageProps) {
  return <ContentListPage type="project" searchParams={searchParams} />;
}
