import { memo } from "react";
import Card from "@/components/Card";
import { getPostsList } from "@/lib/api";

type CardsListProps = {
  limit: number;
  offset: number;
};

const CardsList = async ({ limit, offset }: CardsListProps) => {
  const data = (await getPostsList(limit, offset)).data.repository.discussions;
  const posts = data.edges.flatMap((edge) => edge.node);

  return posts.length > 0 ? (
    posts.map((post) => (
      <Card
        key={post.number}
        id={post.number}
        title={post.title}
        createdAt={post.updatedAt}
        category={post.category}
      />
    ))
  ) : (
    <div className="p-4 rounded-lg bg-neutral-800 text-center text-neutral-300 font-semibold">
      No posts found
    </div>
  );
};

export default memo(CardsList);
