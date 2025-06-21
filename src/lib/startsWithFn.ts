export type Compare = (key: string) => boolean;

export default function startsCaseInsensitiveFn(string: string): Compare {
  const lower = string.toLowerCase();
  const upper = string.toUpperCase();
  return function startsCaseInsensitive(key: string): boolean {
    if (key.length < string.length) return false;
    for (let i = 0; i < string.length; i++) {
      if (key[i] !== lower[i] && key[i] !== upper[i]) return false;
    }
    return true;
  };
}
