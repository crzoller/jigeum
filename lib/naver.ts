// ─── Naver DataLab Search (general keyword volume) ───────────────────────────

export type NaverTrend = {
  title: string;
  keywords: string[];
  period: string;
  data: { period: string; ratio: number }[];
};

// Naver Datalab API allows max 5 keyword groups per request
const DATALAB_CATEGORIES = [
  { name: "Lifestyle", keywords: ["여행", "운동", "건강", "뷰티", "인테리어"] },
  { name: "Entertainment", keywords: ["드라마", "영화", "예능", "웹툰", "아이돌"] },
  { name: "Memes", keywords: ["밈", "유행어", "챌린지", "바이럴", "트렌드"] },
];

type NaverSearchResult = {
  keyword: string;
  ratio: number;
};

export async function fetchNaverTrends(): Promise<NaverSearchResult[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Naver API credentials not set");
  }

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];
  const startDate = new Date(today.setDate(today.getDate() - 7))
    .toISOString()
    .split("T")[0];

  const results: NaverSearchResult[] = [];

  for (const category of DATALAB_CATEGORIES) {
    const body = {
      startDate,
      endDate,
      timeUnit: "date",
      keywordGroups: category.keywords.map((kw) => ({
        groupName: kw,
        keywords: [kw],
      })),
    };

    const res = await fetch("https://openapi.naver.com/v1/datalab/search", {
      method: "POST",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`Naver DataLab error for ${category.name}: ${res.status}`);
      continue;
    }

    const data = await res.json();

    for (const result of data.results ?? []) {
      const latestRatio = result.data?.[result.data.length - 1]?.ratio ?? 0;
      if (latestRatio > 20) {
        results.push({ keyword: result.title, ratio: latestRatio });
      }
    }
  }

  return results.sort((a, b) => b.ratio - a.ratio).slice(0, 20);
}

// ─── Naver Blog Search (specific trending topics for Food & Fashion) ──────────

export type NaverBlogResult = {
  category: string;
  titles: string[];
};

const BLOG_QUERIES: { category: string; query: string }[] = [
  { category: "Food", query: "요즘 유행 음식 맛집" },
  { category: "Food", query: "신상 카페 디저트 요즘" },
  { category: "Fashion", query: "요즘 패션 트렌드 스타일" },
  { category: "Fashion", query: "유행 옷 코디 브랜드" },
];

/** Fetch recent Naver blog post titles for food & fashion trend discovery */
export async function fetchNaverBlogTrends(): Promise<NaverBlogResult[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) return [];

  const byCategory: Record<string, string[]> = {};

  for (const { category, query } of BLOG_QUERIES) {
    const url = new URL("https://openapi.naver.com/v1/search/blog");
    url.searchParams.set("query", query);
    url.searchParams.set("sort", "date");
    url.searchParams.set("display", "20");

    try {
      const res = await fetch(url.toString(), {
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });

      if (!res.ok) {
        console.warn(`Naver Blog error for "${query}": ${res.status}`);
        continue;
      }

      const data = await res.json();
      const titles: string[] = (data.items ?? []).map((item: any) =>
        // Strip HTML tags Naver sometimes includes in titles
        (item.title as string).replace(/<[^>]+>/g, "").trim()
      );

      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(...titles);
    } catch (err) {
      console.warn(`Naver Blog fetch failed for "${query}":`, err);
    }
  }

  return Object.entries(byCategory).map(([category, titles]) => ({
    category,
    titles: [...new Set(titles)], // dedupe
  }));
}
