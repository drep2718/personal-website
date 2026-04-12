import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Interests } from "@/components/sections/interests";

export const metadata = {
  title: "Interests — Aiden Drep",
};

export default function InterestsPage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <Interests />
      </main>
      <Footer />
    </>
  );
}
