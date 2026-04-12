import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Experience } from "@/components/sections/experience";

export const metadata = {
  title: "Experience — Aiden Drep",
};

export default function ExperiencePage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <Experience />
      </main>
      <Footer />
    </>
  );
}
