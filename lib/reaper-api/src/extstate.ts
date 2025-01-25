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

type EncodeTypeName = "string" | "number" | "json";
type EncodeTypeMap = {
  string: string;
  number: number;
  json: object;
};

export function TypedSection<T extends Record<string, EncodeTypeName>>(
  section: string,
  config: T,
) {
  type ConfigType<K extends keyof T> = EncodeTypeMap[T[K]];

  return {
    /**
     * Set a ext state.
     *
     * WARNING: An empty string is the same as setting as null!
     */
    set<K extends string & keyof T>(
      key: K,
      value: ConfigType<K> | null,
      permanent?: boolean,
    ) {
      const configTypeName: EncodeTypeName = config[key];

      switch (configTypeName) {
        case "string": {
          const typedValue = value as EncodeTypeMap["string"] | null;
          set(section, key, typedValue, permanent);
          break;
        }
        case "number": {
          const typedValue = value as EncodeTypeMap["number"] | null;
          set(section, key, typedValue?.toString() || null, permanent);
          break;
        }
        case "json": {
          const typedValue = value as EncodeTypeMap["json"] | null;
          set(section, key, JSON.encode(typedValue), permanent);
          break;
        }
        default:
          assertUnreachable(configTypeName);
      }
    },
    /**
     * This returns a string or null.
     *
     * Conditions for returning null:
     * - key is not set
     * - key is set to an empty string (length 0)
     */
    get<K extends string & keyof T>(key: K): ConfigType<K> | null {
      const configTypeName: EncodeTypeName = config[key];

      switch (configTypeName) {
        case "string": {
          const value = get(section, key);
          return value as ConfigType<K> | null;
        }
        case "number": {
          const value = tonumber(get(section, key)) || null;
          return value as ConfigType<K> | null;
        }
        case "json": {
          const value = get(section, key);
          if (value === null) return null;
          return JSON.decode(value) as ConfigType<K> | null;
        }
        default:
          assertUnreachable(configTypeName);
      }
    },
  };
}
