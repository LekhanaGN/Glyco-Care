"use client";

import { useState } from "react";
import { getPrediction } from "../lib/api";

export default function InsightsPage() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const handlePredict = async () => {
    const res = await getPrediction(sequence);
    setResult(res);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Insights</h1>

      <input
        type="text"
        placeholder="Enter glucose values comma-separated"
        className="text-black p-2"
        onChange={(e) =>
          setSequence(e.target.value.split(",").map(Number))
        }
      />

      <button onClick={handlePredict} className="ml-2 bg-blue-500 p-2">
        Predict
      </button>

      {result && (
        <div className="mt-4">
          <p>Predicted Glucose: {result.predicted_glucose}</p>
          <p>Risk: {result.risk}</p>

          <p className="mt-2">Future Values:</p>
          <ul>
            {result.future_values.map((v: number, i: number) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}