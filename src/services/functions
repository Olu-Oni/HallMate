export const deepCompareObjects = (obj1, obj2) => {
  // If both are the same object, return true
  if (obj1 === obj2) return true;

  // If either is not an object or is null, return false
  if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
    return false;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If the number of keys is different, return false
  if (keys1.length !== keys2.length) return false;

  // Recursively compare each key and value
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepCompareObjects(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};