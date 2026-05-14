export type NaverTrend = {
  title: string;
  keywords: string[];
  period: string;
  data: { period: string; ratio: number }[];
};

// Naver Datalab API allows max 5 keyword groups per request
const CATEGORIES = [
  { name: "Food", keywords: ["음식", "맛집", "요리", "카페", "디저트"] },
  { name: "Fashion", keywords: ["패션", "옷", "스타일", "코디", "브랜드"] },
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

  for (const category of CATEGORIES) {
    const body = {
      startDate,
      endDate,
      timeUnit: "date",
      keywordGroups: category.keywords.map((kw) => ({
        groupName: kw,
        keywords: [kw],
      })),
    };

    const res = await fetch(
      "https://openapi.naver.com/v1/datalab/search",
      {
        method: "POST",
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      console.warn(`Naver API error for ${category.name}: ${res.status}`);
      continue;
    }

    const data = await res.json();

    for (const result of data.results ?? []) {
      const latestRatio =
        result.data?.[result.data.length - 1]?.ratio ?? 0;
      if (latestRatio > 20) {
        results.push({
          keyword: result.title,
          ratio: latestRatio,
        });
      }
    }
  }

  return results.sort((a, b) => b.ratio - a.ratio).slice(0, 20);
}
