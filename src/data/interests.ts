export interface Interest {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export const INTERESTS: Interest[] = [
  { id: "astronomy",  title: "Astronomy",        description: "Telescopes, astrophotography, and the scale of the universe.", emoji: "🔭" },
  { id: "music",      title: "Music Production", description: "Electronic music, synthesis, and generative audio systems.", emoji: "🎛️" },
  { id: "philosophy", title: "Philosophy",        description: "Philosophy of mind, epistemology, and the nature of intelligence.", emoji: "📚" },
  { id: "climbing",   title: "Rock Climbing",     description: "Bouldering problems and the meditative state it induces.", emoji: "🧗" },
  { id: "coffee",     title: "Specialty Coffee",  description: "Single origins, pour-over technique, and roast profiles.", emoji: "☕" },
  { id: "design",     title: "Design",            description: "Typography, spatial interfaces, and calm technology.", emoji: "✏️" },
];
