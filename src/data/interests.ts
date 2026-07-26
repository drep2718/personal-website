export interface Interest {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  details: string[];
  link?: { href: string; label: string };
}

export const INTERESTS: Interest[] = [
  {
    id: "competitive-programming",
    title: "Competitive Programming",
    tagline: "Timed problems, clean algorithms, the rush of the solve.",
    emoji: "🏆",
    details: [
      "This is the one I get genuinely obsessed with. Give me a countdown, a problem that looks impossible, and that moment where the right algorithm finally clicks — I'm hooked.",
      "I love the whole toolkit: dynamic programming, graph algorithms, greedy proofs, and squeezing a clean solution out of a brutal time limit. I practice constantly and help teach it too, running problem-solving and interview-prep sessions at Boiler Quant.",
    ],
  },
  {
    id: "math",
    title: "Mathematics",
    tagline: "Abstract algebra and the structures underneath everything.",
    emoji: "🧮",
    details: [
      "Abstract algebra is my favorite corner of mathematics — groups, rings, and fields turn \"this feels symmetric\" into something you can actually prove. Once you learn to see group structure, you see it everywhere.",
      "What hooks me most is how far the applications reach: symmetry groups powering geometric deep learning, finite fields behind cryptography and error-correcting codes, and representation theory quietly running physics. I even put it to work attacking an open geometry problem with a symmetry-group sweep.",
    ],
  },
  {
    id: "hardware",
    title: "Hardware",
    tagline: "Robots at ARC, and logic gates you can hold.",
    emoji: "🔌",
    details: [
      "I lead a team at Purdue's Autonomous Robotics Club (ARC), where we wrangle Sphero robots, open-source APIs, and every hardware-software gremlin in between.",
      "FPGAs are the deep end I keep diving back into — I've built a pipelined Black-Scholes pricing core in SystemVerilog, and nothing beats watching logic you wired yourself run in actual silicon at nanosecond speed.",
    ],
  },
  {
    id: "systems",
    title: "Systems & DevOps",
    tagline: "The machinery that makes fast code run at scale.",
    emoji: "⚙️",
    details: [
      "The flip side of fast algorithms is big systems. I love digging into system design — and the DevOps stack that makes it real: containerizing services with Docker, orchestrating them with Kubernetes, and understanding exactly what happens between a request and a response.",
    ],
  },
  {
    id: "climbing",
    title: "Climbing",
    tagline: "Bouldering now — mountains next.",
    emoji: "🧗",
    details: [
      "Bouldering is problem-solving you can feel: reading a route from the ground is half the send, and the meditative lock-in on the wall is the other half.",
      "The long-term dream is mountaineering. I'm building toward alpine routes and, eventually, big glaciated peaks — every session on the wall is training for mountains I haven't met yet.",
    ],
  },
  {
    id: "reading",
    title: "Reading",
    tagline: "Fantasy epics and far too much manga.",
    emoji: "📖",
    details: [
      "Hand me a fantasy series with a hard magic system and a thousand pages of payoff and I'll disappear for a week. Between epics I read manga constantly — everything from long-running shonen to quiet one-volume stories.",
      "I keep a full log of everything I've read and watched hidden somewhere on this site. Curious? Try /secret/vault.",
    ],
    link: { href: "/secret/vault", label: "Enter the vault" },
  },
  {
    id: "barista",
    title: "Home Barista",
    tagline: "Espresso shots, dialed in daily.",
    emoji: "☕",
    details: [
      "I like to pretend I'm a barista at home — espresso machine hissing, grinder dialed to the gram, chasing that one perfect 25-second shot.",
      "Most mornings start with a small ritual of tamping, timing, and tasting. The latte art is a work in progress; the caffeine dependency is fully shipped.",
    ],
  },
];
