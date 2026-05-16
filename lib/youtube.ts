import { YouTubeVideoWithId } from "./claude";

export type { YouTubeVideoWithId };

export type YouTubeCategorySearch = {
  category: string;
  videos: { title: string; channelTitle: string; videoId: string }[];
};

/** Search YouTube for category-specific content to surface Food & Fashion trends */
export async function searchYouTubeCategoryVideos(
  searches: { category: string; query: string }[]
): Promise<YouTubeCategorySearch[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const results: YouTubeCategorySearch[] = [];

  for (const { category, query } of searches) {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("q", query);
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "15");
    url.searchParams.set("regionCode", "KR");
    url.searchParams.set("relevanceLanguage", "ko");
    url.searchParams.set("order", "viewCount");
    url.searchParams.set("publishedAfter", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    url.searchParams.set("key", apiKey);

    try {
      const res = await fetch(url.toString());
      if (!res.ok) continue;
      const data = await res.json();
      const videos = (data.items ?? []).map((item: any) => ({
        title: item.snippet?.title ?? "",
        channelTitle: item.snippet?.channelTitle ?? "",
        videoId: item.id?.videoId ?? "",
      }));
      results.push({ category, videos });
    } catch {
      // fail silently
    }
  }

  return results;
}

/** Search YouTube for a single video and return its ID. Returns null on failure. */
export async function searchYouTubeVideo(query: string): Promise<string | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("regionCode", "KR");
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    const data = await res.json();
    return (data.items?.[0]?.id?.videoId as string) ?? null;
  } catch {
    return null;
  }
}

export async function fetchKoreaTrendingVideos(): Promise<YouTubeVideoWithId[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is not set");

  const listUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  listUrl.searchParams.set("part", "snippet,statistics");
  listUrl.searchParams.set("chart", "mostPopular");
  listUrl.searchParams.set("regionCode", "KR");
  listUrl.searchParams.set("maxResults", "50");
  listUrl.searchParams.set("key", apiKey);

  const res = await fetch(listUrl.toString());
  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  return (data.items ?? []).map((item: any) => ({
    id: item.id as string,
    title: item.snippet?.title ?? "",
    channelTitle: item.snippet?.channelTitle ?? "",
    description: (item.snippet?.description ?? "").slice(0, 300),
    tags: item.snippet?.tags ?? [],
    viewCount: item.statistics?.viewCount ?? "0",
    likeCount: item.statistics?.likeCount ?? "0",
  }));
}
