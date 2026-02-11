/**
 * エラトステネスの篩を使って、n以下の素数を列挙
 */
export function getPrimesUpTo(n: number): number[] {
  if (n < 2) return [];
  
  const isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  return isPrime.map((p, i) => p ? i : -1).filter(i => i > 0);
}

/**
 * ランダムな素数の積を生成（タイルの値）
 * 2～10の範囲の素数（2, 3, 5, 7）から選択し、その積を計算
 * 一つずつ積を計算し、9999を超えたら一つ前の値を使用
 * @param maxPrime 使用されていません（後方互換性のため保持）
 * @param maxTileValue タイルの最大値（デフォルト: 9999）
 */
export function generateTileValue(maxPrime: number, maxTileValue: number = 9999): number {
  // 2～10の範囲の素数のみを使用
  const availablePrimes = [2, 3, 5, 7];
  const MAX_VALUE = maxTileValue;
  
  // ランダムに1～4個の素数を選択（重複を許す）
  const count = Math.floor(Math.random() * 4) + 1;
  const selectedPrimes: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomPrime = availablePrimes[Math.floor(Math.random() * availablePrimes.length)];
    selectedPrimes.push(randomPrime);
  }
  
  // 一つずつ積を計算し、9999を超えたら一つ前の値を使用
  let value = 1;
  let previousValue = 1;
  
  for (const prime of selectedPrimes) {
    previousValue = value;
    value *= prime;
    
    // 9999を超えたら一つ前の値を返す
    if (value > MAX_VALUE) {
      return previousValue;
    }
  }
  
  return value;
}

/**
 * aがbの約数かどうか
 */
export function isDivisor(a: number, b: number): boolean {
  return b % a === 0;
}

/**
 * 平方数かどうか
 */
export function isPerfectSquare(n: number): boolean {
  const sqrt = Math.sqrt(n);
  return sqrt === Math.floor(sqrt);
}

/**
 * 立方数かどうか
 */
export function isPerfectCube(n: number): boolean {
  const cbrt = Math.cbrt(n);
  return Math.abs(cbrt - Math.round(cbrt)) < 1e-10;
}

/**
 * 完全累乗かどうか（平方数または立方数）
 */
export function isPerfectPower(n: number): boolean {
  return isPerfectSquare(n) || isPerfectCube(n);
}

/**
 * n以降の次の素数を取得
 */
export function getNextPrime(n: number): number {
  let candidate = n + 1;
  if (candidate < 2) return 2;
  
  while (true) {
    let isPrime = true;
    for (let i = 2; i <= Math.sqrt(candidate); i++) {
      if (candidate % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      return candidate;
    }
    candidate++;
  }
}

/**
 * 数値が素数かどうかを判定
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * 数値の素因数分解を行う（重複を含む）
 * 例: 12 -> [2, 2, 3], 15 -> [3, 5]
 */
export function getPrimeFactors(n: number): number[] {
  const factors: number[] = [];
  let num = n;
  
  // 2で割り切れる間
  while (num % 2 === 0) {
    factors.push(2);
    num = num / 2;
  }
  
  // 3以降の奇数で割る
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    while (num % i === 0) {
      factors.push(i);
      num = num / i;
    }
  }
  
  // numが1より大きい場合、それ自体が素数
  if (num > 1) {
    factors.push(num);
  }
  
  return factors;
}

/**
 * 数値の素因数分解を行う（ユニークな素数のみ）
 * 例: 12 -> [2, 3], 15 -> [3, 5]
 */
export function getUniquePrimeFactors(n: number): number[] {
  const factors = getPrimeFactors(n);
  return [...new Set(factors)];
}
