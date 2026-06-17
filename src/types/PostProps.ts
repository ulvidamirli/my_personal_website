export type Labels = { nodes: { name: string }[] };

export type PostNode = {
  title: string;
  updatedAt: string;
  number: number;
};

export type PostsListProps = {
  search: {
    nodes: PostNode[];
  };
};

export type PostDetail = {
  bodyHTML: string;
  publishedAt: string;
  updatedAt: string;
  title: string;
  number: number;
  labels: Labels;
};

export type PostDetailProps = {
  repository: {
    discussion: PostDetail | null;
  };
};

// A photo is a discussion (labelled "Photo") whose body contains an image; the
// title is the caption.
export type Photo = {
  id: number;
  src: string;
  alt: string;
  title: string;
};

export type PhotoNode = {
  number: number;
  title: string;
  bodyHTML: string;
};

export type PhotosProps = {
  search: {
    nodes: PhotoNode[];
  };
};
