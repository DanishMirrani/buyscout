import { HomePage } from "@/features/home";

export const revalidate = 3600; // ISR: revalidate every hour

export default function Page() {
  return <HomePage />;
}