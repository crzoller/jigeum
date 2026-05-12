export type Trend = {
  id: number;
  rank: number;
  korean_name: string;
  english_name: string;
  description: string;
  category: string;
  subcategory: string;
  days_trending: number;
  volume_score: number;
  snapshots: number[];
};

export const CATEGORIES = [
  "All",
  "Food",
  "Music",
  "Fashion",
  "Memes",
  "Lifestyle",
  "Entertainment",
] as const;

export const mockTrends: Trend[] = [
  {
    id: 1,
    rank: 1,
    korean_name: "탕후루",
    english_name: "Tanghulu",
    description:
      "Candied fruit on skewers — originally from China, now everywhere in Korea. Strawberry and grape are the most popular. Lines are hours long at peak locations in Hongdae.",
    category: "Food",
    subcategory: "Street food",
    days_trending: 47,
    volume_score: 88,
    snapshots: [45, 60, 75, 88],
  },
  {
    id: 2,
    rank: 2,
    korean_name: "뉴진스 컴백",
    english_name: "NewJeans comeback",
    description:
      "K-pop group NewJeans returned with a highly anticipated new album, dominating Korean charts within hours of release.",
    category: "Music",
    subcategory: "K-pop",
    days_trending: 2,
    volume_score: 95,
    snapshots: [10, 20, 60, 95],
  },
  {
    id: 3,
    rank: 3,
    korean_name: "무지출 챌린지",
    english_name: "No-spend challenge",
    description:
      "A viral social trend where participants try to spend zero money for a set number of days, sharing their progress online.",
    category: "Lifestyle",
    subcategory: "Wellness",
    days_trending: 19,
    volume_score: 72,
    snapshots: [50, 65, 70, 72],
  },
  {
    id: 4,
    rank: 4,
    korean_name: "이게 맞아?",
    english_name: '"Is this right?" meme',
    description:
      "A reaction meme format expressing disbelief or confusion at everyday situations, widely used across Korean social media.",
    category: "Memes",
    subcategory: "Reaction",
    days_trending: 8,
    volume_score: 68,
    snapshots: [30, 50, 62, 68],
  },
  {
    id: 5,
    rank: 5,
    korean_name: "Y2K 룩",
    english_name: "Y2K fashion revival",
    description:
      "Early 2000s fashion is back in Seoul — low-rise jeans, bedazzled accessories, and butterfly clips are everywhere on Insta.",
    category: "Fashion",
    subcategory: "Streetwear",
    days_trending: 31,
    volume_score: 61,
    snapshots: [55, 58, 60, 61],
  },
  {
    id: 6,
    rank: 6,
    korean_name: "흑백요리사",
    english_name: "Black and White Chef",
    description:
      "A Netflix cooking competition that pits top Korean chefs against each other, currently the most-watched show in Korea.",
    category: "Entertainment",
    subcategory: "TV",
    days_trending: 5,
    volume_score: 80,
    snapshots: [20, 45, 70, 80],
  },
  {
    id: 7,
    rank: 7,
    korean_name: "런닝크루",
    english_name: "Running crews",
    description:
      "Organized group running clubs have exploded in Seoul, with hundreds of crews meeting weekly across the city's Han River paths.",
    category: "Lifestyle",
    subcategory: "Fitness",
    days_trending: 38,
    volume_score: 55,
    snapshots: [48, 50, 53, 55],
  },
  {
    id: 8,
    rank: 8,
    korean_name: "숏폼 드라마",
    english_name: "Short-form dramas",
    description:
      "Vertical video serial dramas under 5 minutes per episode, made for phone screens, are becoming a major new format in Korean entertainment.",
    category: "Entertainment",
    subcategory: "Digital",
    days_trending: 22,
    volume_score: 52,
    snapshots: [30, 38, 46, 52],
  },
];
