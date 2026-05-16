import { YouTubeVideoWithId } from "./claude";

export type { YouTubeVideoWithId };

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
