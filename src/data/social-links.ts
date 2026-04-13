export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string; // lucide icon name
}

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "github",   label: "GitHub",   url: "https://github.com/drep2718",                     icon: "Github" },
  { id: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/aiden-drepaniotis",       icon: "Linkedin" },
  { id: "email",    label: "Email",    url: "mailto:aidendrepaniotis@gmail.com",               icon: "Mail" },
];
