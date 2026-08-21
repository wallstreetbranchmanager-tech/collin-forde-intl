import { redirect } from "next/navigation";

/** Exact AES design at /index.html */
export default function HomePage() {
  redirect("/index.html");
}
