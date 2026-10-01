/**
 * @file code128.ts
 * @description Pure, standard-compliant Code 128 (Subset B) 1D barcode generator.
 * Produces exact vector rect bars for 100% optical readability on barcode scanners and mobile cameras.
 */

// Code 128 patterns for values 0 to 106.
// Each string has 6 digits representing the module widths of alternating bars and spaces.
// Stop code (106) has 7 digits (terminating bar of width 2).
const CODE128_PATTERNS: string[] = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213', // 0-9
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132', // 10-19
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211', // 20-29
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313', // 30-39
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331', // 40-49
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111', // 50-59
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214', // 60-69
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111', // 70-79
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141', // 80-89
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141', // 90-99
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112' // 100-106 (104=Start B, 106=Stop)
];

export interface BarcodeBar {
  x: number;
  width: number;
}

export interface EncodedBarcode {
  bars: BarcodeBar[];
  totalWidth: number;
  text: string;
}

export function encodeCode128B(text: string, moduleWidth: number = 2): EncodedBarcode {
  const cleanText = text.trim();
  const patternIndices: number[] = [];

  // Start with Start Code B (index 104)
  const startCode = 104;
  patternIndices.push(startCode);

  let checksum = startCode;

  // Convert each ASCII character in Subset B (ASCII 32 to 126)
  for (let i = 0; i < cleanText.length; i++) {
    const code = cleanText.charCodeAt(i);
    // Value = ASCII code - 32
    const val = Math.max(0, Math.min(94, code - 32));
    patternIndices.push(val);
    checksum += (i + 1) * val;
  }

  // Checksum modulo 103
  const checkChar = checksum % 103;
  patternIndices.push(checkChar);

  // Stop character (index 106)
  patternIndices.push(106);

  // Convert patterns into physical x coordinates
  const bars: BarcodeBar[] = [];
  // Standard quiet zone: at least 10 modules on each side
  const quietZone = 10 * moduleWidth;
  let currentX = quietZone;

  for (const idx of patternIndices) {
    const pattern = CODE128_PATTERNS[idx] || CODE128_PATTERNS[0];
    let isBar = true;

    for (let p = 0; p < pattern.length; p++) {
      const barModules = parseInt(pattern[p], 10);
      const w = barModules * moduleWidth;

      if (isBar) {
        bars.push({ x: currentX, width: w });
      }

      currentX += w;
      isBar = !isBar;
    }
  }

  const totalWidth = currentX + quietZone;

  return {
    bars,
    totalWidth,
    text: cleanText,
  };
}
