import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Interests } from "@/components/sections/interests";
import { Waves } from "@/components/ui/waves";

export const metadata = {
  title: "Interests — Aiden Drep",
};

export default function InterestsPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Waves
          strokeColor="rgba(196,30,58,0.45)"
          backgroundColor="transparent"
          opacity={1}
        />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        <PageNavbar />
        <main className="pt-16">
          <Interests />
        </main>
        <Footer />
      </div>
    </>
  );
}
