import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { About } from "@/components/sections/about";

export const metadata = {
  title: "About — Aiden Drep",
};

export default function AboutPage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <About />
      </main>
      <Footer />
    </>
  );
}
