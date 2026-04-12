import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className,
  fullWidth = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-24 md:py-32",
        className
      )}
    >
      <div className={cn(fullWidth ? "w-full" : "mx-auto max-w-6xl px-6 md:px-8")}>
        {children}
      </div>
    </section>
  );
}
