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
    title: "Senior Software Engineer",
    organization: "Acme Corp",
    location: "Remote",
    startDate: "2022-06",
    endDate: null,
    description: "Led development of a real-time data platform processing 10M+ events/day. Built and scaled microservices architecture across 3 engineering teams.",
    tags: ["TypeScript", "Go", "AWS", "Kafka"],
  },
  {
    id: "exp-2",
    type: "experience",
    title: "Software Engineer",
    organization: "Startup XYZ",
    location: "San Francisco, CA",
    startDate: "2020-08",
    endDate: "2022-05",
    description: "Full-stack development of core product features. Reduced API response time by 60% through query optimization and caching strategies.",
    tags: ["React", "Python", "PostgreSQL"],
  },
  {
    id: "edu-1",
    type: "education",
    title: "B.S. Computer Science",
    organization: "State University",
    location: "Somewhere, USA",
    startDate: "2016-09",
    endDate: "2020-05",
    description: "Focus on systems programming and distributed computing. Dean's List 3 semesters.",
    tags: ["Algorithms", "OS", "Distributed Systems"],
  },
];
