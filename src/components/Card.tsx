import { memo } from "react";
import Link from "next/link";

type CardProps = {
  id: number;
  title: string;
  createdAt: string;
  category: string;
}

const Card = ({ id, title, createdAt, category }: CardProps) => {
  const date = new Date(createdAt);
  const formatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });
  const formattedDate = formatter.format(date);

  return (
    <Link href={`/posts/${id}`} className="block mb-4">
      <article className="px-4 py-5 border border-neutral-800 rounded-xl space-y-2 hover:bg-neutral-800 duration-200">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex flex-wrap items-baseline space-x-4 text-sm text-neutral-300">
          {category && (
            <span className="px-4 py-1 rounded bg-white/10">{category}</span>
          )}
          <span>{formattedDate}</span>
        </div>
      </article>
    </Link>
  );
};

const CardSkeleton = () => {
  return (
    <div className="px-4 py-5 mb-4 border border-neutral-800 rounded-xl">
      <div className="space-y-3 animate-pulse">
        <div className="h-5 max-w-md bg-neutral-400 rounded" />
        <div className="flex flex-wrap items-baseline space-x-4 text-sm text-neutral-300">
          <div className="h-4 w-24 bg-neutral-400 rounded" />
        </div>
      </div>
    </div>
  );
};
const MemoizedCardSkeleton = memo(CardSkeleton);

export type { CardProps };
export default memo(Card);
export { MemoizedCardSkeleton as CardSkeleton };
