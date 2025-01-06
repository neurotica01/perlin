import { createNoise2D } from 'simplex-noise';
import Alea from 'alea';

// Add type declaration for Alea
declare class AleaClass {
    constructor(seed?: string);
}

// Create a seeded random number generator
const prng = new (Alea as any)('your-seed-here');

// Create a new noise generator with our seeded PRNG
const noise2D = createNoise2D(prng);

// Basic 2D noise function that returns values between -1 and 1
export function noise(x: number, y: number): number {
  const scale = 0.02;
  return noise2D(x * scale, y * scale);
}

// Enhanced octave noise function
export function octaveNoise(
  x: number, 
  y: number, 
  octaves: number = 4, 
  persistence: number = 0.5
): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    total += noise(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  // Normalize and apply a more dramatic power curve
  const power = 3.5;
  return Math.pow(Math.abs(total / maxValue), power) * Math.sign(total);
} 