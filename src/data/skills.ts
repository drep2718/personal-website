export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "concept";
  level: 1 | 2 | 3; // 3 = innermost orbit (strongest)
}

export const SKILLS: Skill[] = [
  // Core languages — orbit 3
  { name: "TypeScript", category: "language",  level: 3 },
  { name: "Python",     category: "language",  level: 3 },
  { name: "Rust",       category: "language",  level: 2 },
  { name: "Go",         category: "language",  level: 2 },
  { name: "SQL",        category: "language",  level: 3 },

  // Frameworks — orbit 2
  { name: "Next.js",    category: "framework", level: 3 },
  { name: "React",      category: "framework", level: 3 },
  { name: "Node.js",    category: "framework", level: 2 },
  { name: "FastAPI",    category: "framework", level: 2 },
  { name: "Tailwind",   category: "framework", level: 3 },

  // Tools — orbit 1
  { name: "Docker",     category: "tool",      level: 2 },
  { name: "AWS",        category: "tool",      level: 2 },
  { name: "Git",        category: "tool",      level: 3 },
  { name: "PostgreSQL", category: "tool",      level: 2 },
  { name: "Redis",      category: "tool",      level: 1 },

  // Concepts — orbit 1
  { name: "AI/ML",      category: "concept",   level: 2 },
  { name: "APIs",       category: "concept",   level: 3 },
  { name: "DevOps",     category: "concept",   level: 1 },
];
