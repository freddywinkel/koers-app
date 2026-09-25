/**
 * Koers — optionele app-vergrendeling (4-cijferige pincode)
 * -------------------------------------------------------------------
 * De pincode wordt NOOIT als platte tekst opgeslagen. We hashen met SHA-256
 * (WebCrypto) plus een app-specifieke salt, en bewaren alleen de hex-hash in
 * settings key 'pin-hash'. Verifiëren = invoer opnieuw hashen en vergelijken.
 *
 * Eerlijke scope: dit is een zachte app-gate tegen meekijkers op een gedeelde
 * telefoon — geen echte beveiligingsgrens. Een 4-cijferige code is met toegang
 * tot het apparaat/IndexedDB brute-forcebaar; echte encryptie van de data
 * past niet in deze architectuur. Dat staat ook zo in de UI-tekst.
 */

/** Settings key waar de hash staat (lege string / afwezig = geen pincode). */
export const PIN_HASH_KEY = 'pin-hash';

/** sessionStorage key: pincode is deze sessie al een keer goed ingevoerd. */
export const PIN_SESSION_KEY = 'vv-pin-ok';
let unlockedHash = '';

/** Exact 4 cijfers. */
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

/** SHA-256 (WebCrypto) van 'salt + pin' als lowercase hex-string. */
export async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(`vv-pin-v1:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Vergelijk invoer met de opgeslagen hash. */
export async function verifyPin(pin: string, storedHash: string): Promise<boolean> {
  if (!isValidPin(pin) || !storedHash) return false;
  return (await hashPin(pin)) === storedHash;
}

/** Markeer deze sessie als ontgrendeld (overleeft SPA-navigatie en reload, niet een nieuwe sessie). */
export function markSessionUnlocked(hash: string): void {
  if (!/^[a-f0-9]{64}$/.test(hash)) return;
  unlockedHash = hash;
  try {
    sessionStorage.setItem(PIN_SESSION_KEY, hash);
  } catch {
    // private mode zonder storage: dan blijft de gate per-mount werken
  }
}

export function isSessionUnlocked(hash: string): boolean {
  if (!/^[a-f0-9]{64}$/.test(hash)) return false;
  if (unlockedHash === hash) return true;
  try {
    return sessionStorage.getItem(PIN_SESSION_KEY) === hash;
  } catch {
    return false;
  }
}

export function clearSessionUnlock(): void {
  unlockedHash = '';
  try {
    sessionStorage.removeItem(PIN_SESSION_KEY);
  } catch {
    // The in-memory session also works when browser storage is unavailable.
  }
}

/** Publish the unlock before reactive settings update, but undo it on a failed save. */
export async function savePin(pin: string, writeHash: (hash: string) => Promise<void>): Promise<void> {
  if (!isValidPin(pin)) throw new Error('Kies precies vier cijfers.');
  const hash = await hashPin(pin);
  markSessionUnlocked(hash);
  try {
    await writeHash(hash);
  } catch (error) {
    clearSessionUnlock();
    throw error;
  }
}
