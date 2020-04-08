/**
 * * if `raw` is an array, return it as-is
 * * if it exists, return it as 1-element array
 * * otherwise, return an empty array
 * @param raw object to check
 */
export const getArray = (raw: any) => {
  return Array.isArray(raw) ? raw : raw ? [ raw ] : [];
};
