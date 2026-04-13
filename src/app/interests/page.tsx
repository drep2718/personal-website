import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Interests } from "@/components/sections/interests";
import { BgSea } from "@/components/ui/bg-sea";

export const metadata = {
  title: "Interests — Aiden Drepaniotis",
};

export default function InterestsPage() {
  return (
    <>
      <BgSea />
      <div className="relative" style={{ zIndex: 1 }}>
        <PageNavbar />
        <main className="pt-16">
          <Interests />
        </main>
        <Footer />
      </div>
    </>
  );
}
