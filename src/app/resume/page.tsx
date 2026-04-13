import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Resume } from "@/components/sections/resume";
import { BgRaymarch } from "@/components/ui/bg-raymarch";

export const metadata = {
  title: "Résumé — Aiden Drepaniotis",
};

export default function ResumePage() {
  return (
    <>
      <BgRaymarch />
      <div className="relative" style={{ zIndex: 1 }}>
        <PageNavbar />
        <main className="pt-16">
          <Resume />
        </main>
        <Footer />
      </div>
    </>
  );
}
