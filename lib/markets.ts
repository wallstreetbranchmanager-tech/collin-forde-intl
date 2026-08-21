/** Key cities Collin serves. Thailand excludes Bangkok by design. */

export const FLORIDA_CITIES = [
  "Miami",
  "Fort Lauderdale",
  "West Palm Beach",
  "Palm Beach",
  "Palm Beach Gardens",
  "Boca Raton",
  "Tampa",
  "St. Petersburg",
  "Clearwater",
  "Sarasota",
  "Naples",
  "Fort Myers",
  "Cape Coral",
  "Orlando",
  "Jacksonville",
  "Destin",
  "Daytona Beach",
] as const;

export const THAILAND_CITIES = [
  "Phuket",
  "Pattaya",
  "Chiang Mai",
  "Hua Hin",
  "Koh Samui",
  "Krabi",
  "Phang Nga",
  "Chiang Rai",
  "Rayong",
  "Koh Phangan",
  "Koh Chang",
  "Hat Yai",
  "Udon Thani",
] as const;

export const TT_CITIES = [
  "Port of Spain",
  "San Fernando",
  "Chaguanas",
  "Arima",
  "Diego Martin",
  "Couva",
  "Point Fortin",
  "Tunapuna",
  "Sangre Grande",
  "Scarborough",
  "Crown Point",
  "Tobago",
] as const;

export const SITE_URL = "https://collin-forde-intl.vercel.app";

export const SEO_TITLE =
  "Collin M. Forde — International Realtor | Florida, Thailand & Trinidad & Tobago";

export const SEO_DESCRIPTION =
  "Collin M. Forde — Mr. Real Estate. Buy, sell, and invest in Miami, Tampa, Naples, Phuket, Pattaya, Chiang Mai, Koh Samui, Port of Spain, Tobago, and more. License #SL3058438. Mon–Fri 9 AM–5 PM Eastern.";

export const SEO_KEYWORDS = [
  "Collin Forde",
  "Collin M. Forde",
  "international realtor",
  "Florida realtor",
  "Dalton Wade Real Estate",
  "SL3058438",
  ...FLORIDA_CITIES.map((c) => `${c} real estate`),
  ...THAILAND_CITIES.map((c) => `${c} property`),
  ...TT_CITIES.map((c) => `${c} real estate`),
  "Thailand investment property",
  "Trinidad Tobago realtor",
  "Florida international buyer",
].join(", ");
