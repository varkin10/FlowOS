"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, PackageCheck, ShoppingCart, Truck, Waypoints } from "lucide-react";

import { cn } from "@/lib/utils";

interface FlowStep {
  icon: React.ElementType;
  label: string;
  detail: string;
  highlighted?: boolean;
}

const steps: FlowStep[] = [
  {
    icon: ShoppingCart,
    label: "Order placed",
    detail: "Customer checks out online",
  },
  {
    icon: Waypoints,
    label: "Sourcing decision",
    detail: "Which store or DC fulfills it?",
    highlighted: true,
  },
  {
    icon: PackageCheck,
    label: "Pick & pack",
    detail: "Item pulled from shelf or DC stock",
  },
  {
    icon: Truck,
    label: "Ships to customer",
    detail: "Carrier hands off for delivery",
  },
];

export function FulfillmentFlowDiagram() {
  return (
    <div
      className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-2"
      role="img"
      aria-label="Order flow: order placed, then a sourcing decision picks a store or distribution center, then pick and pack, then the order ships to the customer."
    >
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            transition={{ duration: 0.4, delay: i * 0.12, ease: "easeOut" }}
            className={cn(
              "flex flex-1 flex-col items-start gap-2 rounded-lg border bg-card p-4",
              step.highlighted && "border-foreground/20 bg-secondary/60"
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-md bg-secondary text-foreground",
                  step.highlighted && "bg-foreground text-background"
                )}
              >
                <step.icon className="size-4" />
              </span>
              {step.highlighted ? (
                <span className="rounded-full border border-foreground/20 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  the hard part
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-sm font-semibold">{step.label}</p>
              <p className="text-xs text-muted-foreground">{step.detail}</p>
            </div>
          </motion.div>

          {i < steps.length - 1 ? (
            <motion.div
              className="flex shrink-0 items-center justify-center self-center py-1 sm:py-0"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <ArrowRight className="size-4 rotate-90 text-muted-foreground sm:rotate-0" />
            </motion.div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}
