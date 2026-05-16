import { Trend } from "@/lib/mock-data";
import TrendCard from "./TrendCard";

type Props = {
  trends: Trend[];
};

export default function TrendGrid({ trends }: Props) {
  const isOdd = trends.length % 2 !== 0;

  return (
    <div className="grid grid-cols-2 gap-3">
      {trends.map((trend, i) => {
        const isLastOdd = isOdd && i === trends.length - 1;
        return (
          <div key={trend.id} className={isLastOdd ? "col-span-2" : ""}>
            <TrendCard trend={trend} />
          </div>
        );
      })}
    </div>
  );
}
