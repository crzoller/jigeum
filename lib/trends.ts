import { sql } from "./db";
import { Trend } from "./mock-data";

async function getSnapshotsForTrend(trendId: number): Promise<number[]> {
  const rows = await sql`
    SELECT volume
    FROM trend_snapshots
    WHERE trend_id = ${trendId}
    ORDER BY date DESC
    LIMIT 4
  `;
  // Reverse to get chronological order (oldest → newest), pad left if < 4
  const values = rows.map((r) => r.volume as number).reverse();
  const padded = Array(4)
    .fill(0)
    .map((_, i) => {
      const offset = 4 - values.length;
      return i >= offset ? values[i - offset] : 0;
    });
  return padded;
}

export async function getTrends(category?: string): Promise<Trend[]> {
  const rows = category && category !== "All"
    ? await sql`
        SELECT * FROM trends_with_days
        WHERE category = ${category}
        ORDER BY rank ASC
      `
    : await sql`
        SELECT * FROM trends_with_days
        ORDER BY rank ASC
      `;

  const trends = await Promise.all(
    rows.map(async (row): Promise<Trend> => {
      const snapshots = await getSnapshotsForTrend(row.id as number);
      return {
        id: row.id as number,
        rank: row.rank as number,
        korean_name: row.korean_name as string,
        english_name: row.english_name as string,
        description: row.description as string,
        category: row.category as string,
        subcategory: (row.subcategory ?? "") as string,
        days_trending: Number(row.days_trending),
        volume_score: (row.volume_score ?? 0) as number,
        snapshots,
      };
    })
  );

  return trends;
}
