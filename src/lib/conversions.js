const WEIGHT_CONVERSIONS = {
  gr: 1,
  kg: 1000,
  oz: 28.35,
  lb: 453.592,
};

const VOLUME_CONVERSIONS = {
  ml: 1,
  l: 1000,
};

export function convertToBaseUnit(quantity, unit, type) {
  const lowerCaseUnit = unit.toLowerCase();
  if (type === 'weight') {
    const factor = WEIGHT_CONVERSIONS[lowerCaseUnit];
    return factor ? quantity * factor : quantity;
  }
  if (type === 'volume') {
    const factor = VOLUME_CONVERSIONS[lowerCaseUnit];
    return factor ? quantity * factor : quantity;
  }
  return quantity; // for type 'units'
}
