import Card from "@/components/Card";
import { getContentList } from "@/lib/api";
import { CONTENT_BASE_PATH, type CardType } from "@/lib/content";
import type { Locale } from "@/i18n/config";

type CardsListProps = {
  type: CardType;
  locale: Locale;
  limit: number;
  emptyMessage?: string;
};

const CardsList = async ({
  type,
  locale,
  limit,
  emptyMessage = "No posts found",
}: CardsListProps) => {
  const items = await getContentList(type, locale, limit);
  const basePath = CONTENT_BASE_PATH[type];

  return items.length > 0 ? (
    items.map((item) => (
      <Card
        key={item.number}
        id={item.number}
        title={item.title}
        date={item.updatedAt}
        locale={locale}
        basePath={basePath}
      />
    ))
  ) : (
    <div className="p-4 rounded-lg bg-muted text-center text-muted-foreground font-semibold">
      {emptyMessage}
    </div>
  );
};

export default CardsList;
