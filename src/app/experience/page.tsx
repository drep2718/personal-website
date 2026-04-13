import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Experience } from "@/components/sections/experience";
import { BgCosmicDiscs } from "@/components/ui/bg-cosmic-discs";

export const metadata = {
  title: "Experience — Aiden Drepaniotis",
};

export default function ExperiencePage() {
  return (
    <>
      <BgCosmicDiscs />
      <div className="relative" style={{ zIndex: 1 }}>
        <PageNavbar />
        <main className="pt-16">
          <Experience />
        </main>
        <Footer />
      </div>
    </>
  );
}
