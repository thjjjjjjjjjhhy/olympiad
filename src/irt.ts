import { DiagnosticResponse } from './types';

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

export function estimateTheta(responses: DiagnosticResponse[]): number {
  let theta = 0; // prior mean 0
  for (let iter = 0; iter < 25; iter++) {
    let grad = -theta; // derivative of prior N(0,1)
    let hess = -1;
    for (const r of responses) {
      const a = clamp(r.difficulty, 0.5, 2.5);
      const b = r.difficulty;
      const e = Math.exp(a * (theta - b));
      const p = e / (1 + e);
      grad += a * (r.correct ? 1 - p : -p);
      hess -= a * a * p * (1 - p);
    }
    const step = grad / hess;
    theta -= step;
    if (Math.abs(step) < 1e-3) break;
  }
  return theta;
}
