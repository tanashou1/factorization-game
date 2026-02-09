import { isPrime, getUniquePrimeFactors } from './math';

/**
 * RGB色を表すインターフェース
 */
interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * 素数に割り当てる基本色のパレット
 * 視覚的に区別しやすい色を選定
 */
const PRIME_COLOR_PALETTE: RGB[] = [
  { r: 255, g: 99, b: 132 },   // 赤系 (2)
  { r: 30, g: 144, b: 255 },   // 濃い青系 (3) - DodgerBlue
  { r: 255, g: 206, b: 86 },   // 黄系 (5)
  { r: 50, g: 205, b: 50 },    // 緑系 (7) - LimeGreen
  { r: 153, g: 102, b: 255 },  // 紫系 (11)
  { r: 255, g: 159, b: 64 },   // オレンジ系 (13)
  { r: 199, g: 199, b: 199 },  // グレー系 (17)
  { r: 120, g: 120, b: 120 },  // 濃いグレー系 (19)
  { r: 0, g: 191, b: 255 },    // 明るい青系 (23) - DeepSkyBlue
  { r: 131, g: 147, b: 202 },  // ラベンダー系 (29)
  { r: 255, g: 0, b: 255 },    // ビビッドマゼンタ (31)
  { r: 0, g: 255, b: 255 },    // ビビッドシアン (37)
  { r: 255, g: 0, b: 0 },      // ビビッド赤 (41)
  { r: 0, g: 255, b: 0 },      // ビビッド緑 (43)
  { r: 255, g: 255, b: 0 },    // ビビッド黄 (47)
  { r: 0, g: 0, b: 255 },      // ビビッド青 (53)
];

/**
 * 最初の25個の素数リスト（モジュールレベルの定数）
 */
const KNOWN_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

/**
 * 素数のインデックスを取得（2から始まる素数の順序）
 */
function getPrimeIndex(prime: number): number {
  const index = KNOWN_PRIMES.indexOf(prime);
  // 既知の素数の場合はそのインデックスを返す
  if (index >= 0) return index;
  
  // 未知の素数の場合は、素数自体をハッシュしてパレットにマッピング
  // (prime - 97) を使用して97以降の素数を均等に分散
  return KNOWN_PRIMES.length + ((prime - 97) % 10);
}

/**
 * 素数に対応する色を取得（パレットをループ）
 */
function getPrimeColor(prime: number): RGB {
  const index = getPrimeIndex(prime);
  return PRIME_COLOR_PALETTE[index % PRIME_COLOR_PALETTE.length];
}

/**
 * 複数の色をミックス（RGB値の平均）
 */
function mixColors(colors: RGB[]): RGB {
  if (colors.length === 0) {
    return { r: 128, g: 128, b: 128 }; // デフォルトはグレー
  }
  
  const sum = colors.reduce(
    (acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b,
    }),
    { r: 0, g: 0, b: 0 }
  );
  
  return {
    r: Math.round(sum.r / colors.length),
    g: Math.round(sum.g / colors.length),
    b: Math.round(sum.b / colors.length),
  };
}

/**
 * RGBをCSS文字列に変換
 */
function rgbToString(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * 色を明るくする（輝度を上げる）
 */
function brightenColor(rgb: RGB, factor: number = 1.2): RGB {
  return {
    r: Math.min(255, Math.round(rgb.r * factor)),
    g: Math.min(255, Math.round(rgb.g * factor)),
    b: Math.min(255, Math.round(rgb.b * factor)),
  };
}

/**
 * タイルの値に基づいて背景色を取得
 * 素数: パレットから色を選択
 * 合成数: 素因数の色をミックス
 */
export function getTileColor(value: number): string {
  if (value === 1) {
    // 1は特別な色（明るい金色のグラデーション）
    return 'linear-gradient(135deg, #FFE55C 0%, #FFF89A 50%, #FFD700 100%)';
  }
  
  if (isPrime(value)) {
    // 素数の場合、明るい色から基本色へのグラデーション
    const color = getPrimeColor(value);
    const brightColor = brightenColor(color, 1.3);
    const rgb = rgbToString(color);
    const brightRgb = rgbToString(brightColor);
    return `linear-gradient(135deg, ${brightRgb} 0%, ${rgb} 100%)`;
  }
  
  // 合成数の場合、素因数の色を混ぜたグラデーション
  const primeFactors = getUniquePrimeFactors(value);
  const colors = primeFactors.map(prime => getPrimeColor(prime));
  
  if (colors.length === 1) {
    // 素数の累乗の場合（例: 4=2², 8=2³）
    const color = colors[0];
    const brightColor = brightenColor(color, 1.3);
    const rgb = rgbToString(color);
    const brightRgb = rgbToString(brightColor);
    return `linear-gradient(135deg, ${brightRgb} 0%, ${rgb} 100%)`;
  }
  
  if (colors.length === 2) {
    // 2つの素因数の場合、両方の色をグラデーションで混ぜる
    const color1 = colors[0];
    const color2 = colors[1];
    const brightColor1 = brightenColor(color1, 1.2);
    const brightColor2 = brightenColor(color2, 1.2);
    const rgb1 = rgbToString(brightColor1);
    const rgb2 = rgbToString(brightColor2);
    return `linear-gradient(135deg, ${rgb1} 0%, ${rgb2} 100%)`;
  }
  
  // 3つ以上の素因数の場合、複数の色をグラデーションで混ぜる
  const gradientStops = colors.map((color, index) => {
    const brightColor = brightenColor(color, 1.2);
    const rgb = rgbToString(brightColor);
    const position = (index / (colors.length - 1)) * 100;
    return `${rgb} ${position}%`;
  }).join(', ');
  
  return `linear-gradient(135deg, ${gradientStops})`;
}
