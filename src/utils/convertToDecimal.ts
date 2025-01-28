/**
 * Converts to decimal
 * If input is a string and invalid format, returns null
 */
export const convertToDecimal = (raOrDec: string | number): number | null => {
  // Handle number input
  if (typeof raOrDec === 'number') {
    return raOrDec;
  }

  // Handle string input
  if (typeof raOrDec !== 'string') {
    return null;
  }

  // Clean input string
  const cleanInput = raOrDec.trim();

  // Pattern for XX:XX:XX.XX or ±XX:XX:XX.XX
  const coordPattern = /^([+-])?(\d{1,2}):(\d{1,2}):(\d{1,2}(?:\.\d+)?)/;
  const match = cleanInput.match(coordPattern);

  if (!match) {
    return null;
  }

  const [, sign, hours, minutes, seconds] = match;

  // Convert components to numbers
  const h = parseFloat(hours);
  const m = parseFloat(minutes);
  const s = parseFloat(seconds);

  // Validate ranges
  if (h >= 24 || m >= 60 || s >= 60) {
    return null;
  }

  // Calculate decimal value
  const decimal = h + m / 60 + s / 3600;

  // Apply sign if present
  return sign === '-' ? -decimal : decimal;
};

// Examples:
// convertToDecimal("05:35:17.3")  // Returns 5.588138888888889
// convertToDecimal("+07:24:25")   // Returns 7.406944444444444
// convertToDecimal("-12:30:45")   // Returns -12.512500000000001
// convertToDecimal("invalid")     // Returns null
// convertToDecimal("25:00:00")    // Returns null (invalid hours)
