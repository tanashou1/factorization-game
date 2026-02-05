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
  { r: 255, g: 99, b: 132 },   // 赤系
  { r: 54, g: 162, b: 235 },   // 青系
  { r: 255, g: 206, b: 86 },   // 黄系
  { r: 75, g: 192, b: 192 },   // 青緑系
  { r: 153, g: 102, b: 255 },  // 紫系
  { r: 255, g: 159, b: 64 },   // オレンジ系
  { r: 199, g: 199, b: 199 },  // グレー系
  { r: 83, g: 211, b: 87 },    // 緑系
  { r: 237, g: 100, b: 166 },  // ピンク系
  { r: 131, g: 147, b: 202 },  // ラベンダー系
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
 * タイルの値に基づいて背景色を取得
 * 素数: パレットから色を選択
 * 合成数: 素因数の色をミックス
 */
export function getTileColor(value: number): string {
  if (value === 1) {
    // 1は特別な色（金色）
    return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
  }
  
  if (isPrime(value)) {
    // 素数の場合、単色のグラデーション
    const color = getPrimeColor(value);
    const rgb = rgbToString(color);
    // 少し暗めの色でグラデーション
    const darkColor = rgbToString({
      r: Math.round(color.r * 0.8),
      g: Math.round(color.g * 0.8),
      b: Math.round(color.b * 0.8),
    });
    return `linear-gradient(135deg, ${rgb} 0%, ${darkColor} 100%)`;
  }
  
  // 合成数の場合、素因数の色をミックス
  const primeFactors = getUniquePrimeFactors(value);
  const colors = primeFactors.map(prime => getPrimeColor(prime));
  const mixedColor = mixColors(colors);
  const rgb = rgbToString(mixedColor);
  
  // 混ぜた色でグラデーション
  const darkColor = rgbToString({
    r: Math.round(mixedColor.r * 0.8),
    g: Math.round(mixedColor.g * 0.8),
    b: Math.round(mixedColor.b * 0.8),
  });
  
  return `linear-gradient(135deg, ${rgb} 0%, ${darkColor} 100%)`;
}
