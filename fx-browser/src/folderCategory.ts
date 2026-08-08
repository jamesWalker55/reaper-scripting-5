/**
 * Splits a raw FX folder name into its category and stem, using `separator`
 * as the delimiter (e.g. "Synths / Serum" -> category "Synths", stem
 * "Serum"). If no separator is found, or the category half is empty,
 * `defaultCategory` is used instead.
 */
export function splitFolderName(
  name: string,
  separator: string,
  defaultCategory: string,
): { categoryName: string; stem: string } {
  const splitPos = name.indexOf(separator);

  let categoryName = name.substring(0, splitPos).trim();
  const stem = name.substring(splitPos + 1, name.length).trim();

  if (categoryName.length === 0) categoryName = defaultCategory;

  return { categoryName, stem };
}
