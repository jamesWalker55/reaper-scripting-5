/** If the project is not saved anywhere, path will be null */
export function currentProject(): { proj: ReaProject; path: string | null } {
  const [proj, path] = reaper.EnumProjects(-1);
  return { proj, path: path.length === 0 ? null : path };
}
