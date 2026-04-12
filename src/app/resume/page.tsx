import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Resume } from "@/components/sections/resume";

export const metadata = {
  title: "Résumé — Aiden Drep",
};

export default function ResumePage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <Resume />
      </main>
      <Footer />
    </>
  );
}
