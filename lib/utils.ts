import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * LBGI (Low Blood Glucose Index) Calculator
 * 
 * Based on the Kovatchev formula for hypoglycemia risk assessment.
 * 
 * Core transformation: f(G) = 1.509 × [ln(G)^1.084 - 5.381]
 * Where G = glucose value in mg/dL
 * 
 * If f(G) < 0, it contributes to hypoglycemia risk
 * LBGI = mean of (10 × f(G)²) for all f(G) < 0
 * 
 * Interpretation:
 * - LBGI < 1.1 → Low risk
 * - 1.1 – 2.5 → Moderate risk
 * - > 2.5 → High risk of hypoglycemia
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Calculate f(G) transformation for a glucose value
 * f(G) = 1.509 × [ln(G)^1.084 - 5.381]
 */
export function calculateFG(glucoseValue: number): number {
  if (glucoseValue <= 0) return 0;
  return 1.509 * (Math.pow(Math.log(glucoseValue), 1.084) - 5.381);
}

/**
 * Calculate LBGI from an array of glucose values
 * LBGI = mean of (10 × f(G)²) for all f(G) < 0
 */
export function calculateLBGI(glucoseValues: number[]): number {
  if (glucoseValues.length === 0) return 0;

  // Calculate f(G) for each glucose value
  const fgValues = glucoseValues.map(g => calculateFG(g));
  
  // Filter only negative f(G) values (contribute to hypoglycemia risk)
  const negativeFgValues = fgValues.filter(fg => fg < 0);
  
  if (negativeFgValues.length === 0) return 0;
  
  // Calculate 10 × f(G)² for each negative f(G)
  const riskContributions = negativeFgValues.map(fg => 10 * Math.pow(fg, 2));
  
  // Return the mean across all readings
  const sum = riskContributions.reduce((acc, val) => acc + val, 0);
  return sum / glucoseValues.length;
}

/**
 * Determine risk level from LBGI value
 * - LBGI < 1.1 → Low risk
 * - 1.1 – 2.5 → Moderate risk
 * - > 2.5 → High risk
 */
export function getRiskLevelFromLBGI(lbgi: number): RiskLevel {
  if (lbgi < 1.1) return 'LOW';
  if (lbgi <= 2.5) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Combined function to calculate LBGI and return risk level
 */
export function assessHypoglycemiaRisk(glucoseValues: number[]): {
  lbgi: number;
  riskLevel: RiskLevel;
  fgValues: number[];
} {
  const fgValues = glucoseValues.map(g => calculateFG(g));
  const lbgi = calculateLBGI(glucoseValues);
  const riskLevel = getRiskLevelFromLBGI(lbgi);
  
  return { lbgi, riskLevel, fgValues };
}
