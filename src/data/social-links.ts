export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string; // lucide icon name
}

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "github",   label: "GitHub",   url: "https://github.com/aidendrep",   icon: "Github" },
  { id: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/aidendrep", icon: "Linkedin" },
  { id: "twitter",  label: "Twitter",  url: "https://twitter.com/aidendrep",  icon: "Twitter" },
  { id: "email",    label: "Email",    url: "mailto:aiden@aidendrep.com",     icon: "Mail" },
];
