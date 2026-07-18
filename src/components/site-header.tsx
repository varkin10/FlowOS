"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { sections } from "@/lib/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sectionIds = sections.map((s) => s.id);

export function SiteHeader() {
  const activeId = useActiveSection(sectionIds);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a
          href="#top"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-background text-xs font-bold">
            F
          </span>
          FlowOS
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Section navigation">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                activeId === section.id &&
                  "bg-secondary text-foreground"
              )}
            >
              {section.navLabel}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 lg:hidden"
                aria-label="Open section navigation"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Section navigation</SheetTitle>
              <SheetDescription className="sr-only">
                Jump to a section of the FlowOS case study.
              </SheetDescription>
              <nav
                className="mt-10 flex flex-col gap-1"
                aria-label="Section navigation"
              >
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                      activeId === section.id &&
                        "bg-secondary text-foreground"
                    )}
                  >
                    <span className="mr-2 text-xs text-muted-foreground/70">
                      {String(section.index).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
