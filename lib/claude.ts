import Anthropic from "@anthropic-ai/sdk";
import { MelonTrack } from "./melon";
import { NaverBlogResult } from "./naver";
import { YouTubeCategorySearch } from "./youtube";

export type YouTubeVideoWithId = {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  tags: string[];
  viewCount: string;
  likeCount: string;
};

export type TrendInput = {
  korean_name: string;
  english_name: string;
  description: string;
  category: string;
  subcategory: string;
  volume_score: number;
  youtube_video_id: string | null;
};

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a Korean culture expert and trend analyst. You receive raw trending data from South Korea (YouTube trending videos + Naver search trends) and return structured JSON describing what is culturally trending.

For each trend, provide:
- korean_name: the Korean name/term in Korean characters (Hangul). If the item is already in Korean, use that. If it's a foreign concept that Koreans use, use the Korean form.
- english_name: short English translation or transliteration (max 4 words)
- description: 2-3 sentences in English explaining what this is and why it's trending. Write for someone outside Korea who is curious but not an expert.
- category: exactly one of [Food, Music, Fashion, Memes, Lifestyle, Entertainment]
- subcategory: a specific tag that describes the type within the category. Use short, punchy labels (1-3 words). Examples by category — Food: "Street Food", "Dessert", "Snack", "Drink", "Restaurant Trend", "Recipe"; Music: "K-pop", "Hip-hop", "Ballad", "Indie", "OST", "Collab"; Fashion: "Streetwear", "Y2K", "Accessories", "Beauty", "Sneakers", "Hairstyle"; Memes: "Viral Phrase", "Dance Challenge", "Reaction Meme", "Parody", "Character"; Lifestyle: "Fitness", "Travel", "Cafe Culture", "Home Decor", "Self-care", "Study"; Entertainment: "TV Drama", "Variety Show", "Gaming", "Film", "Webtoon", "Celebrity"
- volume_score: integer 0-100 representing relative trend strength based on view counts and search ratios
- youtube_video_id: the YouTube video ID (e.g. "dQw4w9WgXcQ") of the most representative video for this trend from the list provided. Use null if no YouTube video matches.

Rules:
- Consolidate similar items (e.g. multiple videos from one K-pop group = one trend)
- Skip news, politics, sports scores, and ads
- Focus on cultural moments: food, music, fashion, memes, lifestyle, entertainment
- For Music trends, treat the Melon chart as the most authoritative source — it is Korea's #1 streaming platform. A song in the Melon Top 10 is more significant than a YouTube view count.
- Prioritize trends that appear across multiple sources (Melon + YouTube, or Melon + Naver) — these are the strongest signals
- Aim for exactly 5 trends per category [Food, Music, Fashion, Memes, Lifestyle, Entertainment] — that's up to 30 trends total. If a category genuinely has fewer than 5 strong signals in the data, include as many as you can find (minimum 1). Rank within each category by strength, then assign global ranks across all categories combined.
- Return ONLY a valid JSON array. No preamble, no markdown fences, no explanation.
- CRITICAL — be SPECIFIC, never generic: every trend must refer to a named, concrete thing.
  - Bad (reject these): "Korean webtoons", "Korean fashion styling", "Korean meme culture", "Korean travel & cafes"
  - Good Food examples: a specific dish going viral (e.g. 마라탕, 탕후루, 흑당라떼), a specific cafe chain or dessert trend (e.g. 두바이 초콜릿, 크로플), a viral recipe or cooking style
  - Good Fashion examples: a specific trend name (e.g. Y2K 패션, 고프코어룩, 슬랙스 코디), a specific brand going viral, a specific accessory or item trending (e.g. 버킷햇, 와이드팬츠)
  - Good Memes/Music/Entertainment examples: specific song titles, specific viral phrases, specific show names
  - Food and Fashion trends exist every single day in Korea — look harder in the YouTube category search and blog titles if you don't see them in trending videos. If a video title mentions a specific food or fashion item, that IS a trend worth including.
  - If the data only supports a broad category with no specific item identifiable, skip it and include the next most specific trend instead.`;

export async function categorizeTrends(
  videos: YouTubeVideoWithId[],
  naverKeywords: { keyword: string; ratio: number }[] = [],
  melonTracks: MelonTrack[] = [],
  naverBlogTrends: NaverBlogResult[] = [],
  categoryVideos: YouTubeCategorySearch[] = []
): Promise<TrendInput[]> {
  const youtubeData = videos
    .map(
      (v, i) =>
        `${i + 1}. ID: ${v.id} | Title: ${v.title} | Channel: ${v.channelTitle} | Views: ${v.viewCount} | Tags: ${v.tags.slice(0, 5).join(", ")}`
    )
    .join("\n");

  const naverData = naverKeywords.length > 0
    ? naverKeywords
        .map((k, i) => `${i + 1}. Keyword: ${k.keyword} | Search ratio: ${k.ratio}`)
        .join("\n")
    : "No Naver data available.";

  const melonData = melonTracks.length > 0
    ? melonTracks
        .map((t) => `${t.rank}. "${t.title}" by ${t.artist}`)
        .join("\n")
    : "No Melon data available.";

  const blogData = naverBlogTrends.length > 0
    ? naverBlogTrends
        .map(
          (b) =>
            `${b.category} blog titles:\n` +
            b.titles.map((t) => `  - ${t}`).join("\n")
        )
        .join("\n\n")
    : "No Naver blog data available.";

  const categoryVideoData = categoryVideos.length > 0
    ? categoryVideos
        .map(
          (c) =>
            `${c.category} YouTube videos (recent, high view count):\n` +
            c.videos.map((v) => `  - "${v.title}" by ${v.channelTitle}`).join("\n")
        )
        .join("\n\n")
    : "";

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is today's trending data from South Korea. Analyze all sources and return structured trend objects.

## Melon Top 50 (Korea's #1 music streaming chart — most authoritative for Music trends):
${melonData}

## YouTube Korea Trending Videos (include the video ID in your response):
${youtubeData}

## Naver Search Term Trends (Korea):
${naverData}

## Naver Blog Post Titles — Food & Fashion (use these to identify specific trending items):
${blogData}

## YouTube Category Search — Food & Fashion (recent high-view videos, use to identify specific trends):
${categoryVideoData || "No category video data available."}

Return structured trend objects covering the most significant cultural trends across all sources.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

  try {
    const trends = JSON.parse(cleaned);
    if (!Array.isArray(trends)) throw new Error("Not an array");
    return trends as TrendInput[];
  } catch {
    console.error("Failed to parse Claude response:", cleaned);
    throw new Error("Claude returned invalid JSON");
  }
}
