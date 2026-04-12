export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  url?: string;
  repoUrl?: string;
  featured: boolean;
  year: number;
}

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Project Alpha",
    description: "A full-stack web application built with Next.js and a custom AI pipeline for real-time data analysis.",
    tags: ["Next.js", "TypeScript", "AI", "PostgreSQL"],
    url: "https://project-alpha.com",
    repoUrl: "https://github.com/aidendrep/project-alpha",
    featured: true,
    year: 2024,
  },
  {
    id: "project-2",
    title: "Project Beta",
    description: "High-performance Rust CLI tool for processing large datasets with sub-millisecond latency.",
    tags: ["Rust", "CLI", "Performance"],
    repoUrl: "https://github.com/aidendrep/project-beta",
    featured: true,
    year: 2024,
  },
  {
    id: "project-3",
    title: "Project Gamma",
    description: "Distributed microservices architecture deployed on AWS with automated CI/CD pipelines.",
    tags: ["Go", "AWS", "Docker", "Kubernetes"],
    featured: false,
    year: 2023,
  },
  {
    id: "project-4",
    title: "Project Delta",
    description: "Open-source Python library for time-series forecasting using transformer models.",
    tags: ["Python", "ML", "Open Source"],
    repoUrl: "https://github.com/aidendrep/project-delta",
    featured: false,
    year: 2023,
  },
];
