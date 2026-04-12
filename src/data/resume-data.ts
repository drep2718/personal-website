export interface ResumeEntry {
  id: string;
  type: "experience" | "education";
  title: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  tags?: string[];
}

export const RESUME_DATA: ResumeEntry[] = [
  {
    id: "exp-1",
    type: "experience",
    title: "Software Engineering Intern",
    organization: "Wealth.com",
    location: "Remote",
    startDate: "2025-06",
    endDate: null,
    description:
      "Assisted in developing the Family Office Suite, delivering estate-planning solutions to 10,000+ monthly users. Built and maintained backend GraphQL and REST APIs and managed frontend state using Jotai. Delivered 40+ production tickets using React, C#, TypeScript, Node.js, AWS, and Docker. Developed AWS infrastructure as code using CDK, including Lambda functions and Step Functions for orchestrating multi-step estate-planning workflows.",
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
    description:
      "Guided 60+ new students through accelerated CS fundamentals, strengthening skills in coding and problem-solving. Provided individualized guidance on core concepts in OOP, algorithms, and debugging. Facilitated daily lab sessions, led lecture reviews, and organized collaborative learning activities.",
    tags: ["Teaching", "Algorithms", "OOP", "Problem Solving"],
  },
  {
    id: "edu-1",
    type: "education",
    title: "B.S. Computer Science & Mathematics",
    organization: "Purdue University",
    location: "West Lafayette, IN",
    startDate: "2024-08",
    endDate: "2028-05",
    description:
      "Systems Programming Track. Relevant coursework: Object Oriented Programming, Data Structures & Algorithms, Computer Architecture, Systems Programming, C Programming, Multivariable Calculus, Discrete Mathematics, Linear Algebra, Differential Equations, Real Analysis, Competitive Programming I & II.",
    tags: ["Systems Programming", "Algorithms", "Mathematics", "Competitive Programming"],
  },
];
