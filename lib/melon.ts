export type MelonTrack = {
  rank: number;
  title: string;
  artist: string;
};

export async function fetchMelonChart(limit = 50): Promise<MelonTrack[]> {
  const res = await fetch("https://www.melon.com/chart/index.htm", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9",
      Referer: "https://www.melon.com/",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Melon fetch failed: ${res.status}`);

  const html = await res.text();

  // Song titles: anchor inside rank01 has title="SONG_TITLE 재생"
  const titles = Array.from(
    html.matchAll(/title="([^"]+) 재생"/g),
    (m) => m[1].trim()
  ).slice(0, limit);

  // Artists: first anchor in each rank02 block has title="ARTIST - 페이지 이동"
  const rank02Blocks = Array.from(
    html.matchAll(/<div class="ellipsis rank02">([\s\S]*?)<\/div>/g),
    (m) => m[1]
  );
  const artists = rank02Blocks
    .map((block) => {
      const m = block.match(/title="([^"]+) - 페이지 이동"/);
      return m ? m[1].replace(/&nbsp;/g, " ").trim() : "";
    })
    .slice(0, limit);

  return titles.map((title, i) => ({
    rank: i + 1,
    title,
    artist: artists[i] ?? "",
  }));
}
