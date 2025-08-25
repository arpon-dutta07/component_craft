"use client";

import { useState } from "react";
import NumberFlow from "@/components/ui/number-flow";

export default function TestNumberFlow() {
  const [value, setValue] = useState(100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">NumberFlow Test</h1>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setValue(v => v - 10)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              -10
            </button>
            
            <div className="text-3xl font-mono font-bold">
              <NumberFlow
                value={value}
                format={{
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }}
                willChange
                className="text-green-600"
                transformTiming={{
                  duration: 400,
                  easing: "ease-out",
                }}
              />
            </div>
            
            <button
              onClick={() => setValue(v => v + 10)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              +10
            </button>
          </div>
          
          <div className="text-center text-sm text-zinc-500">
            Current value: {value}
          </div>
        </div>
      </div>
    </div>
  );
}
