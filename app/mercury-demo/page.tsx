import { Metadata } from "next";

import { MercuryDemo } from "@/components/examples/mercury-demo";

export const metadata: Metadata = {
  title: "Mercury OS Demo - Flowy Cards",
  description:
    "Demonstration of Mercury OS design principles: fluid, focused, and familiar interfaces with cognitive accessibility",
  keywords: [
    "Mercury OS",
    "design system",
    "accessibility",
    "focus management",
    "dashboard",
  ],
};

export default function MercuryDemoPage() {
  return (
    <div data-intent="mercury-demo-page">
      <MercuryDemo />
    </div>
  );
}
