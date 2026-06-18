import { getPhotos } from "@/lib/api";
import PhotoGallery from "@/components/PhotoGallery";
import { getLocale } from "@/i18n/locale";
import { getDictionary } from "@/i18n/dictionaries";

type PhotosGridProps = {
  limit: number;
};

// Server Component: fetches photos (language-agnostic) and hands them — with
// locale-translated UI labels — to the client gallery (which renders the
// masonry grid + modal).
const PhotosGrid = async ({ limit }: PhotosGridProps) => {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const photos = await getPhotos(limit);

  return (
    <PhotoGallery
      photos={photos}
      labels={{
        empty: t.photos.empty,
        close: t.photos.close,
        view: t.photos.view,
      }}
    />
  );
};

export default PhotosGrid;
