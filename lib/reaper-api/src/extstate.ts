import * as JSON from "json";
import { assertUnreachable } from "./utils";

/**
 * Set a ext state. Defaults to permanent.
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

type EncodeTypeMap = {
  string: string;
  number: number;
  json: any;
};

const SETTERS: {
  [K in keyof EncodeTypeMap]: (
    section: string,
    key: string,
    permanent: boolean,
  ) => (value: EncodeTypeMap[K] | null) => void;
} = {
  string(section, key, permanent) {
    return (value) => set(section, key, value, permanent);
  },
  number(section, key, permanent) {
    return (value) => set(section, key, value?.toString() || null, permanent);
  },
  json(section, key, permanent) {
    return (value) =>
      set(
        section,
        key,
        value === null || value === undefined ? null : JSON.encode(value),
        permanent,
      );
  },
};

const GETTERS: {
  [K in keyof EncodeTypeMap]: (
    section: string,
    key: string,
  ) => () => EncodeTypeMap[K] | null;
} = {
  string(section, key) {
    return () => get(section, key);
  },
  number(section, key) {
    return () => tonumber(get(section, key)) || null;
  },
  json(section, key) {
    return () => {
      const text = get(section, key);
      if (text === null) return null;

      return JSON.decode(text);
    };
  },
};

type TypedSection<Config extends Record<string, keyof EncodeTypeMap>> = {
  [K in keyof Config]: EncodeTypeMap[Config[K]];
};

export function TypedSection<T extends Record<string, keyof EncodeTypeMap>>(
  section: string,
  config: T,
): TypedSection<T> {
  const rv: Partial<TypedSection<T>> = {};

  for (const [key, value] of Object.entries(config)) {
    Object.defineProperty(rv, key, {
      get: GETTERS[value](section, key),
      set: SETTERS[value](section, key, true),
    });
  }

  return rv as TypedSection<T>;
}
