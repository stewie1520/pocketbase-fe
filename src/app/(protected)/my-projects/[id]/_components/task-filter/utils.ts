export function buildQuery(array: string[]) {
  const query: Record<string, Record<string, string | string[]>> = {};
  for (let i = 0; i < array.length; i += 3) {
    if (array[i + 2] === undefined) {
      continue;
    }

    const field = array[i];
    const operator = array[i + 1];
    const value = array[i + 2];
    query[field] = { [operator]: value };
  }

  return query;
}
