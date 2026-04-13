import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aidendrepaniotis.com";
  const pages = ["/", "/about", "/projects", "/experience", "/skills", "/interests", "/resume"];
  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
