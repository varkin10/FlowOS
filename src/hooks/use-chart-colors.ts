"use client";

import * as React from "react";
import { useTheme } from "next-themes";

const LIGHT = {
  foreground: "oklch(0.145 0 0)",
  mutedForeground: "oklch(0.556 0 0)",
  border: "oklch(0.922 0 0)",
  tooltipBg: "oklch(1 0 0)",
};

const DARK = {
  foreground: "oklch(0.985 0 0)",
  mutedForeground: "oklch(0.708 0 0)",
  border: "oklch(1 0 0 / 15%)",
  tooltipBg: "oklch(0.205 0 0)",
};

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted && resolvedTheme === "dark" ? DARK : LIGHT;
}
