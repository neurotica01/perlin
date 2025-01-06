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

// Basic 2D noise function that returns values between 0 and 1
export function noise(x: number, y: number): number {
  const scale = 0.02;
  // Convert from [-1,1] to [0,1] range
  return (noise2D(x * scale, y * scale) + 1) * 0.5;
}

// Enhanced octave noise function that returns values between 0 and 1
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

  // Normalize to [0,1] range and apply power curve
  const normalizedValue = total / maxValue;
  const power = 3.5;
  return Math.pow(normalizedValue, power);
} 