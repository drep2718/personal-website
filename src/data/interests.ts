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
      "I really do enjoy Competitive Programming it is something that I started by taking CS211 & CS311 at Purdue, it is something that is challenging and fun and I really enjoy codeforces even though I am not the best yet",
    ],
    link: { href: "https://codeforces.com/profile/aidendrep", label: "Codeforces Account" },
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
      "FPGAs are the deep end I keep diving back into, I've built a pipelined Black-Scholes pricing core in SystemVerilog, and nothing beats watching logic you wired yourself run in actual silicon at nanosecond speed.",
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
      "Bouldering is something I got into last year, falling into the CS stereotype, it is has become one of my favorite things to do in the gym, on the weekends, and the wall is a great place for a yap session",
      "Mountaineering is something that I want to get into more, I have always liked hiking and I think I want to attempt to summit some peaks in NY soon, stay tuned!!",
    ],
    link: { href: "https://all-mountains.vercel.app/", label: "Mountaineering app I created" },
  },
  {
    id: "reading",
    title: "Reading",
    tagline: "Fantasy epics and far too much manga.",
    emoji: "📖",
    details: [
      "I am a huge reading fan, weather it is high fantasy and Brandon Sanderson, or some fujimoto manga I am a fan and I love talking about what I read",
      "I keep a full log of everything I've read and watched hidden somewhere on this site. Curious? Try /secret/vault.",
    ],
    link: { href: "/secret/vault", label: "Enter the vault" },
  },
  {
    id: "photography",
    title: "Photography",
    tagline: "Chasing light — and the frames worth keeping.",
    emoji: "📷",
    details: [
      "I'm always half-looking for a good frame — long shadows, city geometry, the sky doing something unusual. Photography is how I slow down and actually notice where I am.",
      "I keep a rolling gallery of the shots I'm proud of. Take a look — it grows whenever I do.",
    ],
    link: { href: "/secret/photos", label: "Open the gallery" },
  },
  {
    id: "barista",
    title: "Home Barista",
    tagline: "Espresso shots, dialed in daily.",
    emoji: "☕",
    details: [
      "I love nothing more than making cool and fun coffes at my house with the fancy espresso machine I have and I like sharing about random quotes and things I think about during the day so definitly give the blog a look below",
    ],
    link: { href: "/secret/blog", label: "Read the blog" },
  },
];
