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
  // Preview image (first image found in the body), or null when none exists.
  image?: { src: string; alt: string } | null;
  // Short plain-text excerpt of the body.
  description?: string;
};

const Card = ({
  id,
  title,
  date,
  locale,
  basePath = "/posts",
  image,
  description,
}: CardProps) => {
  const formattedDate = new Intl.DateTimeFormat(localeTags[locale], {
    dateStyle: "long",
  }).format(new Date(date));

  return (
    <Link href={discussionPath(basePath, id, title)} className="block mb-4">
      <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-card-surface hover:bg-card-surface-hover duration-200">
        {image && (
          // Remote GitHub attachments with unknown intrinsic dimensions, so a
          // plain <img> with a fixed thumbnail box rather than next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="h-44 w-full sm:h-40 sm:w-60 shrink-0 rounded object-cover"
          />
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          )}
          <div className="flex flex-wrap items-baseline space-x-4 text-sm text-muted-foreground">
            <span>{formattedDate}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const CardSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 mb-4 bg-card-surface rounded-lg">
      <div className="h-44 w-full sm:h-40 sm:w-60 shrink-0 rounded-lg bg-muted animate-pulse" />
      <div className="min-w-0 flex-1 space-y-3 animate-pulse">
        <div className="h-5 max-w-md bg-muted rounded" />
        <div className="h-4 w-full max-w-sm bg-muted rounded" />
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
