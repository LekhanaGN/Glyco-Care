export async function getPrediction(sequence: number[]) {
  const res = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ sequence }),
  });

  return res.json();
}