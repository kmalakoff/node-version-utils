/**
 * Compatibility Layer for Node.js 0.8+
 * Local to test files - contains only needed functions.
 */

// String.prototype.includes (ES2015)
export function stringIncludes(str: string, search: string, position?: number): boolean {
  if (typeof str.includes === 'function') {
    return str.includes(search, position);
  }
  position = position || 0;
  return str.indexOf(search, position) !== -1;
}
