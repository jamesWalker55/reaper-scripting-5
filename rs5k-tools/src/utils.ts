/** Create a temporary PCM source and destroy it once the function returns. */
export function withPcmSource<T>(
  path: string,
  func: (source: PCM_source) => T,
): T {
  const source = reaper.PCM_Source_CreateFromFile(path);

  let error = null;
  let rv: T;
  try {
    rv = func(source);
  } catch (e) {
    error = e;
    rv = null as T;
  }

  reaper.PCM_Source_Destroy(source);

  if (error !== null) throw error;

  return rv;
}

export function getTimeSelection() {
  const [start, end] = reaper.GetSet_LoopTimeRange2(
    0,
    false,
    false,
    0,
    0,
    false,
  );
  return [start, end];
}

export function setTimeSelection(start: number, end: number) {
  reaper.GetSet_LoopTimeRange2(0, true, false, start, end, false);
}

/** Save the current time selection and restore it once the function returns. */
export function withSavedTimeSelection<T>(
  func: (start: number, end: number) => T,
): T {
  const [start, end] = getTimeSelection();

  let error = null;
  let rv: T;
  try {
    rv = func(start, end);
  } catch (e) {
    error = e;
    rv = null as T;
  }

  setTimeSelection(start, end);

  if (error !== null) throw error;

  return rv;
}
