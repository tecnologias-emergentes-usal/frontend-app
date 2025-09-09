import React from "react";
import { SurveillanceIcon } from "./SurveillanceIcon";

export function SurveillanceIconExample() {
  return (
    <section>
      <h3 className="text-lg font-semibold mb-2">Default Icon (Primary Color)</h3>
      <div className="flex justify-center mb-6">
        <SurveillanceIcon width={300} height={220} />
      </div>

      <h3 className="text-lg font-semibold mb-2">With Accent Color</h3>
      <div className="flex justify-center mb-6">
        <SurveillanceIcon
          width={300}
          height={220}
          primaryColor="#FF9800"
          secondaryColor="#616161"
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">Small Icon</h3>
      <div className="flex justify-center mb-6">
        <SurveillanceIcon width={150} height={110} />
      </div>

      <h3 className="text-lg font-semibold mb-2">Custom Class with Card Background</h3>
      <div className="flex justify-center mb-6 bg-card p-6 rounded-lg">
        <SurveillanceIcon
          width={200}
          height={150}
          className="shadow-lg rounded-lg p-4 bg-white"
        />
      </div>
    </section>
  );
}