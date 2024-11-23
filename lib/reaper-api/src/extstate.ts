/**
 * Set a ext state.
 *
 * WARNING: An empty string is the same as setting as null!
 */
export function set(
  section: string,
  key: string,
  value: string | null,
  permanent?: boolean,
) {
  if (permanent === undefined) permanent = true;

  if (value === null || value.length === 0) {
    reaper.DeleteExtState(section, key, permanent);
  } else {
    reaper.SetExtState(section, key, value, permanent);
  }
}

/**
 * This returns a string or null.
 *
 * Conditions for returning null:
 * - key is not set
 * - key is set to an empty string (length 0)
 */
export function get(section: string, key: string) {
  const rv = reaper.GetExtState(section, key);
  if (rv.length === 0) return null;
  return rv;
}

/**
 * Check if the key is set, even if the value is an empty string `""`.
 * @deprecated The other functions `set` and `get` treat `""` the same
 * as 'key not set', so this function is an outlier.
 */
export function has(section: string, key: string) {
  return reaper.HasExtState(section, key);
}

/**
 * Wrapper around a section for easier usage.
 */
export function Section(section: string) {
  return {
    /**
     * Set a ext state.
     *
     * WARNING: An empty string is the same as setting as null!
     */
    set(key: string, value: string | null, permanent?: boolean) {
      set(section, key, value, permanent);
    },
    /**
     * This returns a string or null.
     *
     * Conditions for returning null:
     * - key is not set
     * - key is set to an empty string (length 0)
     */
    get(key: string) {
      return get(section, key);
    },
  };
}
