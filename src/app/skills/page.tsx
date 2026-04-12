import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Skills } from "@/components/sections/skills";

export const metadata = {
  title: "Skills — Aiden Drep",
};

export default function SkillsPage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <Skills />
      </main>
      <Footer />
    </>
  );
}
