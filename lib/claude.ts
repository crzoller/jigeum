import Anthropic from "@anthropic-ai/sdk";
import { YouTubeVideo } from "./youtube";

export type TrendInput = {
  korean_name: string;
  english_name: string;
  description: string;
  category: string;
  subcategory: string;
  volume_score: number;
};

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a Korean culture expert and trend analyst. You receive raw trending data from South Korea (YouTube trending videos) and return structured JSON describing what is culturally trending.

For each trend, provide:
- korean_name: the Korean name/term in Korean characters (Hangul). If the item is already in Korean, use that. If it's a foreign concept that Koreans use, use the Korean form.
- english_name: short English translation or transliteration (max 4 words)
- description: 2-3 sentences in English explaining what this is and why it's trending. Write for someone outside Korea who is curious but not an expert.
- category: exactly one of [Food, Music, Fashion, Memes, Lifestyle, Entertainment]
- subcategory: a more specific tag (e.g. "K-pop", "Street food", "TV drama", "Viral video", "Fitness")
- volume_score: integer 0-100 representing relative trend strength based on view counts and engagement

Rules:
- Consolidate similar items (e.g. multiple videos from one K-pop group = one trend)
- Skip news, politics, sports scores, and ads
- Focus on cultural moments: food, music, fashion, memes, lifestyle, entertainment
- Return 8-12 trends maximum
- Return ONLY a valid JSON array. No preamble, no markdown fences, no explanation.`;

export async function categorizeTrends(
  videos: YouTubeVideo[]
): Promise<TrendInput[]> {
  const rawData = videos
    .map(
      (v, i) =>
        `${i + 1}. Title: ${v.title} | Channel: ${v.channelTitle} | Views: ${v.viewCount} | Tags: ${v.tags.slice(0, 5).join(", ")}`
    )
    .join("\n");

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is today's YouTube trending data from South Korea. Analyze and return structured trend objects:\n\n${rawData}`,
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
