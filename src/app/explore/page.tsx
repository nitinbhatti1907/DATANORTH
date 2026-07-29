import { getIndicatorsRepository } from "@/lib/server/data-repository";
import { getRequestLocale } from "@/lib/server/locale";
import { ExploreContent } from "./explore-content";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const locale = await getRequestLocale();
  const indicators = await getIndicatorsRepository(locale);

  return <ExploreContent indicators={indicators} locale={locale} />;
}
