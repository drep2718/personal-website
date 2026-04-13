import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Projects } from "@/components/sections/projects";
import { BgFractals } from "@/components/ui/bg-fractals";

export const metadata = {
  title: "Projects — Aiden Drepaniotis",
};

export default function ProjectsPage() {
  return (
    <>
      <BgFractals />
      <div className="relative" style={{ zIndex: 1 }}>
        <PageNavbar />
        <main className="pt-16">
          <Projects />
        </main>
        <Footer />
      </div>
    </>
  );
}
