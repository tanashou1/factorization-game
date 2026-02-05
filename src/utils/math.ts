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
 */
export function generateTileValue(maxPrime: number): number {
  const primes = getPrimesUpTo(maxPrime);
  if (primes.length === 0) return 2;
  
  const MAX_VALUE = 999999;
  
  // 1～primes.length個の素数をランダムに選択（重複を許す）
  const count = Math.floor(Math.random() * primes.length) + 1;
  const selectedPrimes: number[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomPrime = primes[Math.floor(Math.random() * primes.length)];
    selectedPrimes.push(randomPrime);
  }
  
  // 積を計算
  let value = 1;
  for (const prime of selectedPrimes) {
    value *= prime;
  }
  
  // 999999を超えた場合、選んだ素数を一つずつ取り除く
  let primesToUse = [...selectedPrimes];
  while (value > MAX_VALUE && primesToUse.length > 0) {
    primesToUse.pop(); // 末尾から素数を削除
    value = 1;
    for (const prime of primesToUse) {
      value *= prime;
    }
  }
  
  // すべての素数を取り除いても999999を超える場合（ありえないが念のため）
  if (value > MAX_VALUE) {
    return 2;
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
