// ELO calculation
export function calculateElo(
  playerElo: number,
  opponentElo: number,
  won: boolean,
  kFactor = 32
): number {
  const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actual = won ? 1 : 0;
  const newElo = Math.round(playerElo + kFactor * (actual - expected));
  return Math.max(100, newElo);
}

export function getEloDiff(
  playerElo: number,
  opponentElo: number,
  won: boolean
): number {
  const newElo = calculateElo(playerElo, opponentElo, won);
  return newElo - playerElo;
}
