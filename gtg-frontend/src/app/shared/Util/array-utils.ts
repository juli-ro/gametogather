export function updateItemInArray<T>(array: T[], id: string, updatedItem: T, getId: (item: T) => string): T[] {
  return array.map(item => getId(item) === id ? updatedItem : item);
}
