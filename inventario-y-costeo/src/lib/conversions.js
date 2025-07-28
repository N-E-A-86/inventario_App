const CONVERSION_FACTORS = {
  gr: 1,
  kg: 1000,
  ml: 1,
  l: 1000,
  oz: 28.35,
  lb: 453.592,
  un: 1, // for "unit"
};

export function convertToGramsOrMl(quantity, unit) {
  const factor = CONVERSION_FACTORS[unit.toLowerCase()];
  if (factor) {
    return quantity * factor;
  }
  return quantity; // Return original quantity if unit is unknown
}
