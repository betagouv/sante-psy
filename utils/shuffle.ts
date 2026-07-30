function seededRandom(seed: number): number {
  // These constants are from the classic "Numerical Recipes" LCG formula
  // search for 'Numerical Recipes' in https://en.wikipedia.org/wiki/Linear_congruential_generator
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;

  const s1 = (a * Math.abs(seed) + c) % m;
  const s2 = (a * s1 + c) % m;
  const s3 = (a * s2 + c) % m;
  return s3 / m;
}

// every hour: different seed
function getHourlySeed(): number {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const label = `${year}${month}${day}${hour}`;
  const hash = label
    .split('')
    .reduce((acc, ch) => Math.imul(31, acc) + ch.charCodeAt(0), 0);
  return Math.abs(hash);
}

function seededShuffle<T>(list: T[], seed: number): void {
  // Fisher-Yates shuffle
  for (let i = list.length - 1; i > 0; i--) {
    // Each iteration uses a different derived seed
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [list[i], list[j]] = [list[j], list[i]];
  }
}

export function shuffleBasedOnHour(list: unknown[]): void {
  seededShuffle(list, getHourlySeed());
}
