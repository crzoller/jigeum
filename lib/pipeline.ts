import { neon } from "@neondatabase/serverless";
import { fetchKoreaTrendingVideos } from "./youtube";
import { categorizeTrends, TrendInput } from "./claude";

export async function runPipeline(): Promise<{ inserted: number; updated: number; deactivated: number }> {
  const sql = neon(process.env.DATABASE_URL!);
  const today = new Date().toISOString().split("T")[0];

  console.log("Step 1: Fetching YouTube Korea trending videos...");
  const videos = await fetchKoreaTrendingVideos();
  console.log(`  → Got ${videos.length} videos`);

  console.log("Step 2: Sending to Claude for categorization...");
  const trends = await categorizeTrends(videos);
  console.log(`  → Got ${trends.length} trends back`);

  let inserted = 0;
  let updated = 0;

  console.log("Step 3: Upserting trends into database...");
  for (let i = 0; i < trends.length; i++) {
    const t = trends[i] as TrendInput;
    const rank = i + 1;

    // Check if this trend already exists (match on korean_name)
    const existing = await sql`
      SELECT id FROM trends WHERE korean_name = ${t.korean_name} LIMIT 1
    `;

    if (existing.length > 0) {
      const trendId = existing[0].id as number;
      // Update existing trend
      await sql`
        UPDATE trends SET
          english_name = ${t.english_name},
          description = ${t.description},
          category = ${t.category},
          subcategory = ${t.subcategory},
          volume_score = ${t.volume_score},
          last_seen_at = ${today},
          rank = ${rank},
          is_active = true,
          updated_at = NOW()
        WHERE id = ${trendId}
      `;
      // Insert snapshot
      await sql`
        INSERT INTO trend_snapshots (trend_id, date, volume)
        VALUES (${trendId}, ${today}, ${t.volume_score})
        ON CONFLICT (trend_id, date) DO UPDATE SET volume = ${t.volume_score}
      `;
      updated++;
      console.log(`  ✓ Updated: ${t.korean_name}`);
    } else {
      // Insert new trend
      const newTrend = await sql`
        INSERT INTO trends (
          korean_name, english_name, description, category, subcategory,
          first_seen_at, last_seen_at, is_active, rank, volume_score
        ) VALUES (
          ${t.korean_name}, ${t.english_name}, ${t.description},
          ${t.category}, ${t.subcategory},
          ${today}, ${today}, true, ${rank}, ${t.volume_score}
        )
        RETURNING id
      `;
      const trendId = newTrend[0].id as number;
      // Insert first snapshot
      await sql`
        INSERT INTO trend_snapshots (trend_id, date, volume)
        VALUES (${trendId}, ${today}, ${t.volume_score})
        ON CONFLICT (trend_id, date) DO NOTHING
      `;
      inserted++;
      console.log(`  ✓ Inserted: ${t.korean_name}`);
    }
  }

  // Deactivate trends not seen today
  const activeTrendNames = trends.map((t) => t.korean_name);
  const deactivateResult = await sql`
    UPDATE trends SET is_active = false
    WHERE is_active = true
    AND last_seen_at < ${today}
    AND korean_name != ALL(${activeTrendNames})
    RETURNING id
  `;
  const deactivated = deactivateResult.length;
  if (deactivated > 0) {
    console.log(`  → Deactivated ${deactivated} old trends`);
  }

  return { inserted, updated, deactivated };
}
