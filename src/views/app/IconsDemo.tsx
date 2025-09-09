'use client';

import { SurveillanceIconExample } from "@/components";

export function IconsDemo() {
  return (
    <div className="bg-background min-h-screen">
      <header className="px-4 py-4">
        <h1 className="text-xl font-semibold">HorusAlert Demo</h1>
      </header>

      <h2 className="text-foreground text-lg font-semibold px-4">SVG Icons</h2>
      <SurveillanceIconExample />

      <h2 className="text-foreground text-lg font-semibold px-4">Color Palette</h2>

      <section className="px-4">
        <h3 className="text-foreground font-semibold mb-2">Color Swatches</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <div className="h-16 bg-primary rounded-t-lg"></div>
            <div className="bg-card p-2 rounded-b-lg">
              <p className="text-foreground font-bold">Primary</p>
              <p className="text-secondary text-sm">#388E3C</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-16 bg-accent rounded-t-lg"></div>
            <div className="bg-card p-2 rounded-b-lg">
              <p className="text-foreground font-bold">Accent</p>
              <p className="text-secondary text-sm">#FF9800</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-16 bg-background rounded-t-lg border border-border"></div>
            <div className="bg-card p-2 rounded-b-lg">
              <p className="text-foreground font-bold">Background</p>
              <p className="text-secondary text-sm">#FFFFFF</p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-16 bg-card rounded-t-lg"></div>
            <div className="bg-card p-2 rounded-b-lg border-t border-border">
              <p className="text-foreground font-bold">Card</p>
              <p className="text-secondary text-sm">#F4F4F4</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}