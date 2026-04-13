import { PageNavbar } from "@/components/layout/page-navbar";
import { Footer } from "@/components/layout/footer";
import { Blog } from "@/components/sections/blog";

export const metadata = {
  title: "Blog — Aiden Drepaniotis",
};

export default function BlogPage() {
  return (
    <>
      <PageNavbar />
      <main className="pt-16">
        <Blog />
      </main>
      <Footer />
    </>
  );
}
