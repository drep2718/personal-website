import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aidendrepaniotis.com";
  const pages = [
    "/",
    "/about",
    "/projects",
    "/experience",
    "/skills",
    "/interests",
    "/resume",
    "/blog",
  ];
  const posts = getAllPosts().map((post) => `/blog/${post.slug}`);
  return [...pages, ...posts].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
