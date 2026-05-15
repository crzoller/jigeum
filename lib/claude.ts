import Anthropic from "@anthropic-ai/sdk";

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
- subcategory: a more specific tag (e.g. "K-pop", "Street food", "TV drama", "Viral video", "Fitness")
- volume_score: integer 0-100 representing relative trend strength based on view counts and search ratios
- youtube_video_id: the YouTube video ID (e.g. "dQw4w9WgXcQ") of the most representative video for this trend from the list provided. Use null if no YouTube video matches.

Rules:
- Consolidate similar items (e.g. multiple videos from one K-pop group = one trend)
- Skip news, politics, sports scores, and ads
- Focus on cultural moments: food, music, fashion, memes, lifestyle, entertainment
- Prioritize trends that appear in BOTH YouTube and Naver data — these are the strongest signals
- Return 8-12 trends maximum, ranked by cultural significance
- Return ONLY a valid JSON array. No preamble, no markdown fences, no explanation.`;

export async function categorizeTrends(
  videos: YouTubeVideoWithId[],
  naverKeywords: { keyword: string; ratio: number }[] = []
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

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is today's trending data from South Korea. Analyze both sources and return structured trend objects.

## YouTube Korea Trending Videos (include the video ID in your response):
${youtubeData}

## Naver Search Term Trends (Korea):
${naverData}

Return structured trend objects covering the most significant cultural trends across both sources.`,
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
