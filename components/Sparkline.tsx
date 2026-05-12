type Props = {
  values: number[];
  height?: number;
};

export default function Sparkline({ values, height = 16 }: Props) {
  // Pad to 4 bars from the left if fewer values
  const bars = Array(4)
    .fill(0)
    .map((_, i) => {
      const offset = 4 - values.length;
      return i >= offset ? values[i - offset] : 0;
    });

  const max = Math.max(...bars, 1);

  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height }}
      aria-hidden="true"
    >
      {bars.map((v, i) => {
        const pct = v / max;
        const barHeight = Math.max(pct * height, v > 0 ? 3 : 1);
        const opacity = v === 0 ? 0.15 : 0.35 + 0.65 * pct;
        return (
          <div
            key={i}
            className="w-[3px] rounded-[1px]"
            style={{
              height: barHeight,
              backgroundColor: "#E8453C",
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}
