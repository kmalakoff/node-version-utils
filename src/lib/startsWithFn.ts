export default function startsWithFn(string) {
  const lower = string.toLowerCase();
  const upper = string.toUpperCase();
  return function startsCaseInsensitive(key) {
    if (key.length < string.length) return false;
    for (let i = 0; i < string.length; i++) {
      if (key[i] !== lower[i] && key[i] !== upper[i]) return false;
    }
    return true;
  };
}
