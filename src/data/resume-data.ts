export interface ResumeEntry {
  id: string;
  type: "experience" | "education" | "leadership";
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  bullets?: string[];
  tags?: string[];
}

export const RESUME_DATA: ResumeEntry[] = [
  // ── Experience ──────────────────────────────────────────────────────────────
  {
    id: "exp-1",
    type: "experience",
    title: "Software Engineering Intern",
    organization: "Wealth.com",
    location: "Remote",
    startDate: "2025-06",
    endDate: null,
    description: "",
    bullets: [
      "Assisted in developing the Family Office Suite, delivering estate-planning solutions to 10,000+ monthly users.",
      "Built and maintained backend GraphQL and REST APIs and managed frontend state using Jotai.",
      "Developed AWS infrastructure as code using CDK, including Lambda functions and Step Functions for orchestrating multi-step estate-planning workflows.",
      "Delivered 40+ production tickets using React, C#, TypeScript, Node.js, AWS, and Docker.",
    ],
    tags: ["TypeScript", "React", "Node.js", "GraphQL", "AWS CDK", "Lambda", "Step Functions", "Docker"],
  },
  {
    id: "exp-2",
    type: "experience",
    title: "Developer Teaching Assistant",
    organization: "Purdue University CS Bridge Program",
    location: "West Lafayette, IN",
    startDate: "2025-06",
    endDate: "2025-08",
    description: "",
    bullets: [
      "Guided 60+ new students through accelerated CS fundamentals, strengthening skills in coding and problem-solving.",
      "Provided individualized guidance on core concepts in OOP, algorithms, and debugging.",
      "Facilitated daily lab sessions, led lecture reviews, and organized collaborative learning activities.",
    ],
    tags: ["Teaching", "Algorithms", "OOP", "Python"],
  },

  // ── Education ───────────────────────────────────────────────────────────────
  {
    id: "edu-1",
    type: "education",
    title: "B.S. Computer Science & Mathematics",
    organization: "Purdue University",
    location: "West Lafayette, IN",
    startDate: "2024-08",
    endDate: "2028-05",
    description: "Systems Programming Track.",
    bullets: [
      "Relevant Coursework: Object Oriented Programming, Data Structures & Algorithms, Computer Architecture, Systems Programming, C Programming.",
      "Mathematics: Multivariable Calculus, Discrete Mathematics, Linear Algebra, Differential Equations, Real Analysis.",
      "Competitive Programming I & II.",
    ],
    tags: ["Systems Programming", "Algorithms", "Mathematics", "Competitive Programming"],
  },

  // ── Leadership & Organizations ──────────────────────────────────────────────
  {
    id: "org-1",
    type: "leadership",
    title: "Director of Quantitative Development Education",
    organization: "Boiler Quantitative Finance Group",
    location: "West Lafayette, IN",
    startDate: "2024-09",
    endDate: null,
    description: "",
    bullets: [
      "Lead weekly educational sessions on quantitative development, covering algorithmic problem solving, competitive programming, and technical interview preparation.",
      "Teach core quantitative topics including options pricing, trading fundamentals, and practical implementation of financial models.",
      "Developed learning materials and mentor members in competitive programming and quantitative finance concepts.",
    ],
    tags: ["Quant Finance", "Options Pricing", "Competitive Programming", "Teaching"],
  },
  {
    id: "org-2",
    type: "leadership",
    title: "Team Lead",
    organization: "Purdue University Autonomous Robotics Club",
    location: "West Lafayette, IN",
    startDate: "2024-09",
    endDate: null,
    description: "",
    bullets: [
      "Lead a team of 5 on system design and development using Sphero Robots to simulate polymerization.",
      "Improved and designed an open-source API for control and precision of the Sphero Robots.",
      "Diagnosed and resolved hardware-software inefficiencies for improved performance.",
    ],
    tags: ["Robotics", "System Design", "Python", "Open Source"],
  },
];

export const CERTIFICATIONS = [
  { name: "Bloomberg Market Concepts",       issuer: "Bloomberg" },
  { name: "Bloomberg Finance Fundamentals",  issuer: "Bloomberg" },
];
