export type PostProps = {
  node: {
    title: string;
    url: string;
    updatedAt: string;
    number: number;
    category: string;
  };
};

export type PostsListProps = {
  data: {
    repository: {
      discussions: {
        edges: PostProps[];
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          startCursor: string;
        };
        totalCount: number;
      };
    };
  };
};

export type PostDetailProps = {
  data: {
    repository: {
      discussion: {
        bodyHTML: string;
        publishedAt: string;
        updatedAt: string;
        title: string;
        number: number;
      };
    };
  };
};
