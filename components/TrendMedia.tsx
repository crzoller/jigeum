type Props = {
  youtubeVideoId?: string | null;
  imageUrl?: string | null;
  title: string;
};

export default function TrendMedia({ youtubeVideoId, imageUrl, title }: Props) {
  if (youtubeVideoId) {
    return (
      <div
        className="w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          style={{ border: "none" }}
        />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div
        className="w-full rounded-lg overflow-hidden"
        style={{ aspectRatio: "16/9", backgroundColor: "#161616" }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return null;
}
