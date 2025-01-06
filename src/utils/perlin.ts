// Simple Perlin noise implementation
export function noise(x: number, y: number): number {
  // Convert coordinates to larger numbers to get smoother noise
  const scale = 0.02;
  x = x * scale;
  y = y * scale;
  
  // Get integer coordinates
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  
  // Get decimal remainders
  x -= Math.floor(x);
  y -= Math.floor(y);
  
  // Fade curves
  const u = fade(x);
  const v = fade(y);
  
  // Hash coordinates
  const A = permutation[X] + Y;
  const AA = permutation[A];
  const AB = permutation[A + 1];
  const B = permutation[X + 1] + Y;
  const BA = permutation[B];
  const BB = permutation[B + 1];
  
  // Blend noise values
  const amplitude = 8.0;
  return lerp(v, 
    lerp(u, grad(AA, x, y), grad(BA, x-1, y)),
    lerp(u, grad(AB, x, y-1), grad(BB, x-1, y-1))
  ) * amplitude;
}

// Add these helper functions above or below your noise function
function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 15;
  return ((h & 1) === 0 ? x : -x) + ((h & 2) === 0 ? y : -y);
}

// Add the permutation table (required for the noise function)
const permutation = new Array(512);
const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,
  142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
  35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,
  139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,
  245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,
  196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
  202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,
  170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,
  98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,
  144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,
  184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,
  141,128,195,78,66,215,61,156,180];

// Duplicate the permutation array
for (let i = 0; i < 256; i++) {
  permutation[i] = permutation[i + 256] = p[i];
} 

// Add this new function for multiple octaves
export function octaveNoise(x: number, y: number, octaves: number = 4, persistence: number = 0.65): number {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;

    for(let i = 0; i < octaves; i++) {
        total += noise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }

    const power = 1.5;
    return Math.pow(Math.abs(total / maxValue), power) * Math.sign(total);
} 