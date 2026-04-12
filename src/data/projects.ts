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
    id: "crypto-arbitrage",
    title: "Crypto Arbitrage Engine",
    description:
      "Designed a dynamic arbitrage model leveraging Bellman-Ford for optimal pathfinding across currency pairs. Implemented real-time data processing via Binance WebSockets for efficient trade execution. Generated synthetic market data to stress-test the model under various volatility regimes.",
    tags: ["Python", "Binance API", "WebSockets", "Bellman-Ford", "Quant Finance"],
    featured: true,
    year: 2025,
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
