import Link from "next/link";
import { discussionPath } from "@/lib/slug";
import { localeTags, type Locale } from "@/i18n/config";

type CardProps = {
  id: number;
  title: string;
  // ISO date string (the discussion's last-updated timestamp).
  date: string;
  locale: Locale;
  basePath?: string;
};

const Card = ({ id, title, date, locale, basePath = "/posts" }: CardProps) => {
  const formattedDate = new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "long",
  }).format(new Date(date));

  return (
    <Link href={discussionPath(basePath, id, title)} className="block mb-4">
      <article className="px-4 py-5 border border-border rounded-xl space-y-2 hover:bg-muted duration-200">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex flex-wrap items-baseline space-x-4 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
        </div>
      </article>
    </Link>
  );
};

const CardSkeleton = () => {
  return (
    <div className="px-4 py-5 mb-4 border border-border rounded-xl">
      <div className="space-y-3 animate-pulse">
        <div className="h-5 max-w-md bg-muted rounded" />
        <div className="flex flex-wrap items-baseline space-x-4 text-sm text-muted-foreground">
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};

export type { CardProps };
export default Card;
export { CardSkeleton };
