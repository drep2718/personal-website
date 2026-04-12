"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { SectionWrapper } from "@/components/layout/section-wrapper";
import { FadeIn } from "@/components/animations/fade-in";
import { BLOG_POSTS } from "@/data/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Blog() {
  return (
    <SectionWrapper id="blog">
      <FadeIn direction="up">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] text-[var(--color-text-muted)] uppercase mb-3">
            Writing
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-[var(--color-text-primary)]">
            Blog
          </h2>
        </div>
      </FadeIn>

      <div className="space-y-px">
        {BLOG_POSTS.map((post, i) => (
          <FadeIn key={post.id} direction="up" delay={i * 0.08}>
            <motion.article
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 py-6 border-b border-[var(--color-border)] cursor-pointer"
            >
              {/* Date + read time */}
              <div className="flex-shrink-0 sm:w-32">
                <p className="text-xs text-[var(--color-text-muted)]">{formatDate(post.date)}</p>
                <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mt-1">
                  <Clock size={10} /> {post.readTime} min
                </p>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base md:text-lg font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-red)] transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="flex-shrink-0 mt-0.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-red)] transition-colors opacity-0 group-hover:opacity-100"
                  />
                </div>
                <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-3 text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  {post.category}
                </span>
              </div>
            </motion.article>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
}
