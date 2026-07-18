"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface SectionShellProps {
  id: string;
  index: number;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SectionShell({
  id,
  index,
  title,
  description,
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-16 border-b border-border/60 py-24", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-muted-foreground/70">
              {String(index).padStart(2, "0")}
            </span>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
          </div>
          {description ? (
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
