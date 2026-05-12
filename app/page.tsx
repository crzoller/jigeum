import TopBar from "@/components/TopBar";
import TrendFeed from "@/components/TrendFeed";
import { mockTrends } from "@/lib/mock-data";
import { getTrends } from "@/lib/trends";

async function loadTrends() {
  if (!process.env.DATABASE_URL) return mockTrends;
  try {
    return await getTrends();
  } catch {
    return mockTrends;
  }
}

export default async function HomePage() {
  const trends = await loadTrends();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0A" }}>
      <TopBar />
      <TrendFeed trends={trends} />
    </div>
  );
}
