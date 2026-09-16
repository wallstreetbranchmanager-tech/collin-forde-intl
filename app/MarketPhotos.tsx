export const MARKET_PHOTOS = {
  fl: "/api/market?id=fl",
  th: "/api/market?id=th",
  tt: "/api/market?id=tt",
} as const;

export function MarketImg({
  id,
  alt,
}: {
  id: keyof typeof MARKET_PHOTOS;
  alt: string;
}) {
  return <img src={MARKET_PHOTOS[id]} alt={alt} loading="lazy" />;
}
