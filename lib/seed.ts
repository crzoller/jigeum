/**
 * Run once to seed the DB with hand-curated trends.
 * Usage: npx tsx lib/seed.ts
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const today = new Date().toISOString().split("T")[0];

const trends = [
  {
    korean_name: "탕후루",
    english_name: "Tanghulu",
    description:
      "Candied fruit on skewers — originally from China, now everywhere in Korea. Strawberry and grape are the most popular. Lines are hours long at peak locations in Hongdae.",
    category: "Food",
    subcategory: "Street food",
    rank: 1,
    volume_score: 88,
    days_back: 47,
    snapshots: [45, 60, 75, 88],
  },
  {
    korean_name: "뉴진스 컴백",
    english_name: "NewJeans comeback",
    description:
      "K-pop group NewJeans returned with a highly anticipated new album, dominating Korean charts within hours of release.",
    category: "Music",
    subcategory: "K-pop",
    rank: 2,
    volume_score: 95,
    days_back: 2,
    snapshots: [10, 20, 60, 95],
  },
  {
    korean_name: "무지출 챌린지",
    english_name: "No-spend challenge",
    description:
      "A viral social trend where participants try to spend zero money for a set number of days, sharing their progress online.",
    category: "Lifestyle",
    subcategory: "Wellness",
    rank: 3,
    volume_score: 72,
    days_back: 19,
    snapshots: [50, 65, 70, 72],
  },
  {
    korean_name: "이게 맞아?",
    english_name: '"Is this right?" meme',
    description:
      "A reaction meme format expressing disbelief or confusion at everyday situations, widely used across Korean social media.",
    category: "Memes",
    subcategory: "Reaction",
    rank: 4,
    volume_score: 68,
    days_back: 8,
    snapshots: [30, 50, 62, 68],
  },
  {
    korean_name: "Y2K 룩",
    english_name: "Y2K fashion revival",
    description:
      "Early 2000s fashion is back in Seoul — low-rise jeans, bedazzled accessories, and butterfly clips are everywhere on Insta.",
    category: "Fashion",
    subcategory: "Streetwear",
    rank: 5,
    volume_score: 61,
    days_back: 31,
    snapshots: [55, 58, 60, 61],
  },
  {
    korean_name: "흑백요리사",
    english_name: "Black and White Chef",
    description:
      "A Netflix cooking competition that pits top Korean chefs against each other, currently the most-watched show in Korea.",
    category: "Entertainment",
    subcategory: "TV",
    rank: 6,
    volume_score: 80,
    days_back: 5,
    snapshots: [20, 45, 70, 80],
  },
  {
    korean_name: "런닝크루",
    english_name: "Running crews",
    description:
      "Organized group running clubs have exploded in Seoul, with hundreds of crews meeting weekly across the city's Han River paths.",
    category: "Lifestyle",
    subcategory: "Fitness",
    rank: 7,
    volume_score: 55,
    days_back: 38,
    snapshots: [48, 50, 53, 55],
  },
  {
    korean_name: "숏폼 드라마",
    english_name: "Short-form dramas",
    description:
      "Vertical video serial dramas under 5 minutes per episode, made for phone screens, are becoming a major new format in Korean entertainment.",
    category: "Entertainment",
    subcategory: "Digital",
    rank: 8,
    volume_score: 52,
    days_back: 22,
    snapshots: [30, 38, 46, 52],
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

async function seed() {
  console.log("Seeding trends...");

  for (const t of trends) {
    const firstSeen = daysAgo(t.days_back);

    const rows = await sql`
      INSERT INTO trends (
        korean_name, english_name, description, category, subcategory,
        first_seen_at, last_seen_at, is_active, rank, volume_score
      ) VALUES (
        ${t.korean_name}, ${t.english_name}, ${t.description},
        ${t.category}, ${t.subcategory},
        ${firstSeen}, ${today}, true, ${t.rank}, ${t.volume_score}
      )
      RETURNING id
    `;

    const trendId = rows[0].id as number;

    // Insert 4 daily snapshots ending today
    for (let i = 0; i < t.snapshots.length; i++) {
      const date = daysAgo(t.snapshots.length - 1 - i);
      await sql`
        INSERT INTO trend_snapshots (trend_id, date, volume)
        VALUES (${trendId}, ${date}, ${t.snapshots[i]})
        ON CONFLICT (trend_id, date) DO NOTHING
      `;
    }

    console.log(`  ✓ ${t.korean_name}`);
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
