import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Projects } from "@/components/sections/projects";

export const metadata = {
  title: "Projects — Aiden Drep",
};

export default function ProjectsPage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <Projects />
      </main>
      <Footer />
    </>
  );
}
