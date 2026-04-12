import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Projects } from "@/components/sections/projects";
import { BgWoven } from "@/components/ui/bg-woven";

export const metadata = {
  title: "Projects — Aiden Drep",
};

export default function ProjectsPage() {
  return (
    <>
      <BgWoven />
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
