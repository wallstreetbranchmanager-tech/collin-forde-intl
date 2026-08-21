import { redirect } from "next/navigation";

/** Serve the exact AES design from public/index.html */
export default function HomePage() {
  redirect("/index.html");
}
