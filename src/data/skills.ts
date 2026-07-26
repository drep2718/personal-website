export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "concept";
  level: 1 | 2 | 3; // 3 = innermost orbit (strongest)
}

export const SKILLS: Skill[] = [
  // ── Core — inner orbit (level 3) ────────────────────────────────
  { name: "C++20",        category: "language",  level: 3 },
  { name: "Python",       category: "language",  level: 3 },
  { name: "Java",         category: "language",  level: 3 },
  { name: "TypeScript",   category: "language",  level: 3 },
  { name: "React",        category: "framework", level: 3 },
  { name: "AWS CDK",      category: "tool",      level: 3 },
  { name: "Lambda",       category: "tool",      level: 3 },

  // ── Proficient — middle orbit (level 2) ─────────────────────────
  { name: "C",              category: "language",  level: 2 },
  { name: "JavaScript",     category: "language",  level: 2 },
  { name: "Git",            category: "tool",      level: 2 },
  { name: "Node.js",        category: "framework", level: 2 },
  { name: "Express",        category: "framework", level: 2 },
  { name: "GraphQL",        category: "framework", level: 2 },
  { name: "Jotai",          category: "framework", level: 2 },
  { name: "Docker",         category: "tool",      level: 2 },
  { name: "Step Functions", category: "tool",      level: 2 },
  { name: "PyTorch",        category: "framework", level: 2 },
  { name: "Keras",          category: "framework", level: 2 },
  { name: "NumPy",          category: "framework", level: 2 },
  { name: "Pandas",         category: "framework", level: 2 },
  { name: "STL",            category: "concept",   level: 2 },
  { name: "Algorithms",     category: "concept",   level: 2 },
  { name: "Data Structures",category: "concept",   level: 2 },

  // ── Familiar — outer orbit (level 1) ────────────────────────────
  { name: "R",                   category: "language",  level: 1 },
  { name: "SystemVerilog",       category: "tool",      level: 1 },
  { name: "TensorFlow",          category: "framework", level: 1 },
  { name: "scikit-learn",        category: "framework", level: 1 },
  { name: "OpenCV",              category: "framework", level: 1 },
  { name: "MediaPipe",           category: "framework", level: 1 },
  { name: "Deep Learning",       category: "concept",   level: 1 },
  { name: "Computer Vision",     category: "concept",   level: 1 },
  { name: "Low-Latency",         category: "concept",   level: 1 },
  { name: "Multithreading",      category: "concept",   level: 1 },
  { name: "Metaprogramming",     category: "concept",   level: 1 },
  { name: "Dynamic Programming", category: "concept",   level: 1 },
  { name: "Black-Scholes",       category: "concept",   level: 1 },
  { name: "Monte Carlo",         category: "concept",   level: 1 },
  { name: "Options Pricing",     category: "concept",   level: 1 },
];
