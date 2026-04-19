export function isNullOrWhitespace( input: string | null | undefined ) {
  return !input || !input.trim();
}
