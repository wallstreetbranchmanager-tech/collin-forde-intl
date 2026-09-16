export function MarketImg({ id, alt }: { id: "fl" | "th" | "tt"; alt: string }) {
  return <img src={`/api/market?id=${id}`} alt={alt} loading="lazy" />;
}
