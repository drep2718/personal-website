export interface Skill {
  name: string;
  category: "language" | "framework" | "tool" | "concept";
  level: 1 | 2 | 3; // 3 = innermost orbit (strongest)
}

export const SKILLS: Skill[] = [
  // Core languages — orbit 3
  { name: "TypeScript",   category: "language",  level: 3 },
  { name: "Python",       category: "language",  level: 3 },
  { name: "JavaScript",   category: "language",  level: 3 },
  { name: "C",            category: "language",  level: 2 },
  { name: "C++",          category: "language",  level: 2 },
  { name: "Java",         category: "language",  level: 2 },
  { name: "R",            category: "language",  level: 1 },

  // Frameworks — orbit 2/3
  { name: "React",        category: "framework", level: 3 },
  { name: "Node.js",      category: "framework", level: 2 },
  { name: "Express",      category: "framework", level: 2 },
  { name: "GraphQL",      category: "framework", level: 2 },
  { name: "Jotai",        category: "framework", level: 2 },
  { name: "Keras",        category: "framework", level: 2 },
  { name: "TensorFlow",   category: "framework", level: 1 },
  { name: "OpenCV",       category: "framework", level: 1 },
  { name: "MediaPipe",    category: "framework", level: 1 },
  { name: "Pandas",       category: "framework", level: 2 },
  { name: "scikit-learn", category: "framework", level: 1 },

  // Tools & Platforms — orbit 1/2
  { name: "AWS CDK",       category: "tool",      level: 2 },
  { name: "Lambda",        category: "tool",      level: 2 },
  { name: "Step Functions",category: "tool",      level: 2 },
  { name: "Docker",        category: "tool",      level: 2 },
  { name: "Git",           category: "tool",      level: 3 },
  { name: "SystemVerilog", category: "tool",      level: 1 },
];
