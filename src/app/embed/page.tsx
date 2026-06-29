import { redirect } from "next/navigation";

export default async function EmbedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(resolved)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  if (!params.has("fresh")) params.set("fresh", "1");
  const query = params.toString();
  redirect(query ? `/embed/case/new?${query}` : "/embed/case/new?fresh=1");
}
