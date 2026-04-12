import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Experience } from "@/components/sections/experience";
import { BgAnomaly } from "@/components/ui/bg-anomaly";

export const metadata = {
  title: "Experience — Aiden Drep",
};

export default function ExperiencePage() {
  return (
    <>
      <BgAnomaly />
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
