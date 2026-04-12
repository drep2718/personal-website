import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Skills } from "@/components/sections/skills";
import { BgHills } from "@/components/ui/bg-hills";

export const metadata = {
  title: "Skills — Aiden Drep",
};

export default function SkillsPage() {
  return (
    <>
      <BgHills />
      <div className="relative" style={{ zIndex: 1 }}>
        <PageNavbar />
        <main className="pt-16">
          <Skills />
        </main>
        <Footer />
      </div>
    </>
  );
}
