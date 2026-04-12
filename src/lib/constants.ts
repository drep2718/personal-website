export const SITE_META = {
  name: "Aiden Drep",
  title: "Aiden Drep — Developer & Builder",
  description:
    "Personal portfolio of Aiden Drep — software engineer, builder, and curious mind.",
  url: "https://aidendrep.com",
};

/** Used by the black hole disc and the page navbar */
export const NAV_PAGES = [
  { id: "about",      label: "About",      path: "/about" },
  { id: "projects",   label: "Projects",   path: "/projects" },
  { id: "experience", label: "Experience", path: "/experience" },
  { id: "skills",     label: "Skills",     path: "/skills" },
  { id: "interests",  label: "Interests",  path: "/interests" },
  { id: "resume",     label: "Resume",     path: "/resume" },
] as const;

export type PageId = (typeof NAV_PAGES)[number]["id"];

export const COLORS = {
  bgPrimary:     "#0A0A0A",
  bgCard:        "#121212",
  border:        "#1E1E1E",
  textPrimary:   "#F5F5F5",
  textSecondary: "#8A8A8A",
  accentRed:     "#C41E3A",
  accentBlue:    "#4A6FA5",
} as const;
