export async function mapAsync<T = any, U = any>(
  arr: T[],
  asyncCallback: (el: T) => Promise<U>
): Promise<U[]> {
  const promises = arr.map(asyncCallback);
  return await Promise.all(promises);
}

export function removeWhitespace(text: string): string {
  return text.replace(/\s/g, "");
}
