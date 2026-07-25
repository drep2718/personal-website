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
    id: "fpga-pricing",
    title: "FPGA Pricing Model",
    description:
      "Built a floating-point unit implementing Black-Scholes on an FPGA for sub-microsecond high-frequency trading. Implemented pipelining for parallel calculations and increased throughput. Ported and benchmarked the algorithm in C++ on an ESP32 microcontroller to establish a baseline for validating FPGA acceleration.",
    tags: ["SystemVerilog", "System Design", "Hardware Acceleration", "C++", "HFT"],
    featured: true,
    year: 2025,
  },
  {
    id: "sofa-gdl",
    title: "Moving Sofa Optimizer",
    description:
      "Differentiable shape optimizer attacking Moser's 1966 unsolved Moving Sofa Problem — recovered 93.5% of Gerver's conjectured optimum from scratch using polar B-splines, augmented Lagrangian constraints, and a geometric deep learning symmetry group sweep across 6 parameterizations.",
    tags: ["Python", "Geometric Deep Learning", "Optimization", "Open Math Problem"],
    repoUrl: "https://github.com/drep2718/sofa-gdl",
    featured: true,
    year: 2026,
  },
  {
    id: "crypto-arbitrage",
    title: "Crypto Arbitrage Engine",
    description:
      "Designed a dynamic arbitrage model leveraging Bellman-Ford for optimal pathfinding across currency pairs. Implemented real-time data processing via Binance WebSockets for efficient trade execution. Generated synthetic market data to stress-test the model under various volatility regimes.",
    tags: ["Python", "Binance API", "WebSockets", "Bellman-Ford", "Quant Finance"],
    featured: true,
    year: 2025,
  },
  {
    id: "sightplay",
    title: "SightPlay",
    description:
      "Full-stack music sight-reading trainer with four drill modes — flash cards, sheet music, interval recognition, and measure-by-measure practice — real-time sheet music rendering, cross-device account sync, JWT auth with Google OAuth, and a Postgres + Redis backend deployed via Docker and nginx.",
    tags: ["TypeScript", "Postgres", "Redis", "Docker", "OAuth"],
    repoUrl: "https://github.com/drep2718/sightplay",
    featured: false,
    year: 2026,
  },
  {
    id: "markets",
    title: "Markets Dashboard",
    description:
      "Next.js commodities dashboard that aggregates real-time market news via RSS, LLM-ranks and summarizes articles by market impact using Llama 3.1, tracks economic events, and includes a structured finance curriculum with 6 learning modules and progress tracking.",
    tags: ["Next.js", "LLM", "RSS", "Quant Finance", "Groq"],
    repoUrl: "https://github.com/drep2718/markets",
    featured: false,
    year: 2026,
  },
  {
    id: "pushup-counter",
    title: "Push-Up Counter",
    description:
      "Developed a neural network using Keras trained on a self-collected dataset for push-up recognition and form correction. Implemented computer vision with MediaPipe's Pose model to track and analyze body movements in real time. Designed an automated system to filter incorrect reps and distinguish between active and idle states.",
    tags: ["Python", "Keras", "MediaPipe", "OpenCV", "Machine Learning"],
    featured: true,
    year: 2024,
  },
];
