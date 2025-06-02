import React from "react";
import { SurveillanceIcon } from "./SurveillanceIcon";
import { Block, BlockTitle } from "konsta/react";

export function SurveillanceIconExample() {
  return (
    <Block>
      <BlockTitle>Default Icon (Primary Color)</BlockTitle>
      <div className="flex justify-center mb-6">
        <SurveillanceIcon width={300} height={220} />
      </div>

      <BlockTitle>With Accent Color</BlockTitle>
      <div className="flex justify-center mb-6">
        <SurveillanceIcon
          width={300}
          height={220}
          primaryColor="#FF9800"
          secondaryColor="#616161"
        />
      </div>

      <BlockTitle>Small Icon</BlockTitle>
      <div className="flex justify-center mb-6">
        <SurveillanceIcon width={150} height={110} />
      </div>

      <BlockTitle>Custom Class with Card Background</BlockTitle>
      <div className="flex justify-center mb-6 bg-card p-6 rounded-lg">
        <SurveillanceIcon
          width={200}
          height={150}
          className="shadow-lg rounded-lg p-4 bg-white"
        />
      </div>
    </Block>
  );
}