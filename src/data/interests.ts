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
    id: "comp-systems",
    title: "Competitive Programming & Systems",
    tagline: "Fast algorithms, and the machinery that runs them at scale.",
    emoji: "⚔️",
    details: [
      "Competitive programming keeps me sharp — the clock, the clean invariants, and the joy of squeezing an O(n log n) solution out of a problem that looks hopeless.",
      "The flip side of fast code is big systems: I love studying system design and the DevOps stack that makes it real — containerizing services with Docker, orchestrating them with Kubernetes, and understanding what actually happens between a request and a response.",
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
    id: "barista",
    title: "Home Barista",
    tagline: "Espresso shots, dialed in daily.",
    emoji: "☕",
    details: [
      "I like to pretend I'm a barista at home — espresso machine hissing, grinder dialed to the gram, chasing that one perfect 25-second shot.",
      "Most mornings start with a small ritual of tamping, timing, and tasting. The latte art is a work in progress; the caffeine dependency is fully shipped.",
    ],
  },
  {
    id: "astronomy",
    title: "Astronomy",
    tagline: "Telescopes and the scale of the universe.",
    emoji: "🔭",
    details: [
      "Telescopes, astrophotography, and the healthy existential vertigo of remembering how big everything is. This whole site's space theme is not a coincidence.",
      "Black holes are the obsession within the obsession — I'm slowly building a C++ ray-traced black hole renderer to see gravitational lensing with my own code.",
    ],
  },
  {
    id: "music",
    title: "Music Production",
    tagline: "Synthesis and generative audio systems.",
    emoji: "🎛️",
    details: [
      "Electronic music production — sound design, synthesis, and the endless rabbit hole of making a synth patch sound alive.",
      "The engineering brain leaks in here too: I'm fascinated by generative audio systems, where a few rules and some randomness compose things I never would have written by hand.",
    ],
  },
];
