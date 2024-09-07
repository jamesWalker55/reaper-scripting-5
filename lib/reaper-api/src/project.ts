/**
 * Return the grid settings of the current project.
 * - `division` represents measures, so 0.25 for quarter note division
 * - `swing` is a number between -1.0 -- 1.0, will be `null` if swing disabled.
 * @returns
 */
export function getGrid() {
  const [rv, div, swingmode, swingamt] = reaper.GetSetProjectGrid(0, false);
  if (!rv) throw new Error("failed to get project grid");

  return { division: div, swing: swingmode === 1 ? swingamt : null };
}
