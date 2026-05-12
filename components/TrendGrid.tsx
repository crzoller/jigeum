import { Trend } from "@/lib/mock-data";
import TrendCard from "./TrendCard";

type Props = {
  trends: Trend[];
};

export default function TrendGrid({ trends }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {trends.map((trend) => (
        <TrendCard key={trend.id} trend={trend} />
      ))}
    </div>
  );
}
