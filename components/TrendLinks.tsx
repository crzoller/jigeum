type Props = {
  koreanName: string;
  englishName: string;
};

export default function TrendLinks({ koreanName, englishName }: Props) {
  const naverUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(koreanName)}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(koreanName)}`;
  const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(englishName)}`;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <a
        href={naverUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-150"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "var(--text-secondary)",
          border: "0.5px solid var(--border)",
          textDecoration: "none",
        }}
      >
        <span>🔍</span> Naver
      </a>
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-150"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "var(--text-secondary)",
          border: "0.5px solid var(--border)",
          textDecoration: "none",
        }}
      >
        <span>▶</span> YouTube
      </a>
      <a
        href={wikiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors duration-150"
        style={{
          background: "rgba(255,255,255,0.06)",
          color: "var(--text-secondary)",
          border: "0.5px solid var(--border)",
          textDecoration: "none",
        }}
      >
        <span>📖</span> Wikipedia
      </a>
    </div>
  );
}
