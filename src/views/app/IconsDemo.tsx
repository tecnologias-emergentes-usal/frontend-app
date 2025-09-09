'use client';

import { Page, Navbar, Block, BlockTitle } from "konsta/react";
import { SurveillanceIconExample } from "@/components";

export function IconsDemo() {
  return (
    <Page className="bg-background">
      <Navbar title="HorusAlert Demo" large transparent centerTitle />
      
      <BlockTitle className="text-foreground">SVG Icons</BlockTitle>
      <SurveillanceIconExample />
      
      <BlockTitle className="text-foreground">Color Palette</BlockTitle>
      
      <Block>
        <BlockTitle className="text-foreground">Color Swatches</BlockTitle>
        <div className="grid grid-cols-2 gap-4 p-4">
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
      </Block>
    </Page>
  );
} 