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
 * 視覚的に区別しやすく、明るく鮮やかな色を選定
 */
const PRIME_COLOR_PALETTE: RGB[] = [
  { r: 255, g: 120, b: 150 },  // 明るい赤系
  { r: 100, g: 180, b: 255 },  // 明るい青系
  { r: 255, g: 220, b: 100 },  // 明るい黄系
  { r: 100, g: 220, b: 220 },  // 明るい青緑系
  { r: 180, g: 130, b: 255 },  // 明るい紫系
  { r: 255, g: 180, b: 100 },  // 明るいオレンジ系
  { r: 220, g: 220, b: 220 },  // 明るいグレー系
  { r: 120, g: 230, b: 120 },  // 明るい緑系
  { r: 255, g: 130, b: 190 },  // 明るいピンク系
  { r: 160, g: 170, b: 230 },  // 明るいラベンダー系
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
