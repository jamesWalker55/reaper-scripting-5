import { FX } from "reaper-api/fx";
import { getSelectedFx } from "reaper-api/selectedFx";
import { confirmBox, errorHandler, msgBox, undoBlock } from "reaper-api/utils";

export enum ProQType {
  Q3,
  Q4,
}

export function getProQType(ident: string): ProQType | null {
  if (ident.indexOf("FabFilter Pro-Q 3") !== -1) {
    return ProQType.Q3;
  } else if (ident.indexOf("FabFilter Pro-Q 4") !== -1) {
    return ProQType.Q4;
  }

  return null;
}

export function coerceVSTType(type: string): "VST" | "VST3" | null {
  switch (type) {
    case "VST":
      return type;
    case "VST3":
      return type;
    default:
      return null;
  }
}

export type Q3Band = {
  version: 3;
  // Whether the band is visible or not
  used: number;
  // Whether the band is explicitly turned off via the toggle button
  enabled: number;
  frequency: number;
  gain: number;
  dynamic_range: number;
  dynamics_enabled: number;
  threshold: number;
  q: number;
  shape: number;
  slope: number;
  stereo_placement: number;
  speakers: number;
  // solo: number; // non-automatable
};

/**
 * Index ranges from 0..=23
 */
export function getQ3Band(fx: FX, idx: number): Q3Band {
  if (!(0 <= idx && idx < 24))
    throw new Error(`Band index ${idx} out of bounds of 0 - 24`);

  const used = fx.getParameter(13 * idx + 0).getValue();
  const enabled = fx.getParameter(13 * idx + 1).getValue();
  const frequency = fx.getParameter(13 * idx + 2).getValue();
  const gain = fx.getParameter(13 * idx + 3).getValue();
  const dynamic_range = fx.getParameter(13 * idx + 4).getValue();
  const dynamics_enabled = fx.getParameter(13 * idx + 5).getValue();
  const threshold = fx.getParameter(13 * idx + 6).getValue();
  const q = fx.getParameter(13 * idx + 7).getValue();
  const shape = fx.getParameter(13 * idx + 8).getValue();
  const slope = fx.getParameter(13 * idx + 9).getValue();
  const stereo_placement = fx.getParameter(13 * idx + 10).getValue();
  const speakers = fx.getParameter(13 * idx + 11).getValue();
  // const solo = fx.getParameter(13 * idx + 12).getValue();

  return {
    version: 3,
    used: used.cur,
    enabled: enabled.cur,
    frequency: frequency.cur,
    gain: gain.cur,
    dynamic_range: dynamic_range.cur,
    dynamics_enabled: dynamics_enabled.cur,
    threshold: threshold.cur,
    q: q.cur,
    shape: shape.cur,
    slope: slope.cur,
    stereo_placement: stereo_placement.cur,
    speakers: speakers.cur,
    // solo: solo.cur,
  };
}

export function getQ3Bands(fx: FX) {
  const bands = [];

  for (let i = 0; i < 24; i++) {
    const band = getQ3Band(fx, i);
    bands.push(band);
  }

  return bands;
}

/**
 * Index ranges from 0..=23
 */
export function setQ3Band(fx: FX, idx: number, band: Q3Band) {
  if (!(0 <= idx && idx < 24))
    throw new Error(`Band index ${idx} out of bounds of 0 - 24`);

  fx.getParameter(13 * idx + 0).setValue(band.used);
  fx.getParameter(13 * idx + 1).setValue(band.enabled);
  fx.getParameter(13 * idx + 2).setValue(band.frequency);
  fx.getParameter(13 * idx + 3).setValue(band.gain);
  fx.getParameter(13 * idx + 4).setValue(band.dynamic_range);
  fx.getParameter(13 * idx + 5).setValue(band.dynamics_enabled);
  fx.getParameter(13 * idx + 6).setValue(band.threshold);
  fx.getParameter(13 * idx + 7).setValue(band.q);
  fx.getParameter(13 * idx + 8).setValue(band.shape);
  fx.getParameter(13 * idx + 9).setValue(band.slope);
  fx.getParameter(13 * idx + 10).setValue(band.stereo_placement);
  fx.getParameter(13 * idx + 11).setValue(band.speakers);
  // fx.getParameter(13 * idx + 12).setValue(band.solo);
}

export type Q4Band = {
  version: 4;
  // Whether the band is visible or not
  used: number;
  // Whether the band is explicitly turned off via the toggle button
  enabled: number;
  frequency: number;
  gain: number;
  q: number;
  shape: number;
  slope: number;
  stereo_placement: number;
  speakers: number;
  dynamic_range: number;
  dynamics_enabled: number;
  dynamics_auto: number;
  threshold: number;
  attack: number;
  release: number;
  external_side_chain: number;
  side_chain_filtering: number;
  side_chain_low_frequency: number;
  side_chain_high_frequency: number;
  // side_chain_audition: number; // non-automatable
  spectral_enabled: number;
  spectral_density: number;
  // solo: number; // non-automatable
};

/**
 * Index ranges from 0..=23
 */
export function getQ4Band(fx: FX, idx: number): Q4Band {
  if (!(0 <= idx && idx < 24))
    throw new Error(`Band index ${idx} out of bounds of 0 - 24`);

  const used = fx.getParameter(23 * idx + 0).getValue();
  const enabled = fx.getParameter(23 * idx + 1).getValue();
  const frequency = fx.getParameter(23 * idx + 2).getValue();
  const gain = fx.getParameter(23 * idx + 3).getValue();
  const q = fx.getParameter(23 * idx + 4).getValue();
  const shape = fx.getParameter(23 * idx + 5).getValue();
  const slope = fx.getParameter(23 * idx + 6).getValue();
  const stereo_placement = fx.getParameter(23 * idx + 7).getValue();
  const speakers = fx.getParameter(23 * idx + 8).getValue();
  const dynamic_range = fx.getParameter(23 * idx + 9).getValue();
  const dynamics_enabled = fx.getParameter(23 * idx + 10).getValue();
  const dynamics_auto = fx.getParameter(23 * idx + 11).getValue();
  const threshold = fx.getParameter(23 * idx + 12).getValue();
  const attack = fx.getParameter(23 * idx + 13).getValue();
  const release = fx.getParameter(23 * idx + 14).getValue();
  const external_side_chain = fx.getParameter(23 * idx + 15).getValue();
  const side_chain_filtering = fx.getParameter(23 * idx + 16).getValue();
  const side_chain_low_frequency = fx.getParameter(23 * idx + 17).getValue();
  const side_chain_high_frequency = fx.getParameter(23 * idx + 18).getValue();
  // const side_chain_audition = fx.getParameter(23 * idx + 19).getValue();
  const spectral_enabled = fx.getParameter(23 * idx + 20).getValue();
  const spectral_density = fx.getParameter(23 * idx + 21).getValue();
  // const solo = fx.getParameter(23 * idx + 22).getValue();

  return {
    version: 4,
    used: used.cur,
    enabled: enabled.cur,
    frequency: frequency.cur,
    gain: gain.cur,
    q: q.cur,
    shape: shape.cur,
    slope: slope.cur,
    stereo_placement: stereo_placement.cur,
    speakers: speakers.cur,
    dynamic_range: dynamic_range.cur,
    dynamics_enabled: dynamics_enabled.cur,
    dynamics_auto: dynamics_auto.cur,
    threshold: threshold.cur,
    attack: attack.cur,
    release: release.cur,
    external_side_chain: external_side_chain.cur,
    side_chain_filtering: side_chain_filtering.cur,
    side_chain_low_frequency: side_chain_low_frequency.cur,
    side_chain_high_frequency: side_chain_high_frequency.cur,
    // side_chain_audition: side_chain_audition.cur,
    spectral_enabled: spectral_enabled.cur,
    spectral_density: spectral_density.cur,
    // solo: solo.cur,
  };
}

export function getQ4Bands(fx: FX) {
  const bands = [];

  for (let i = 0; i < 24; i++) {
    const band = getQ4Band(fx, i);
    bands.push(band);
  }

  return bands;
}

/**
 * Index ranges from 0..=23
 */
export function setQ4Band(fx: FX, idx: number, band: Q4Band) {
  if (!(0 <= idx && idx < 24))
    throw new Error(`Band index ${idx} out of bounds of 0 - 24`);

  fx.getParameter(23 * idx + 0).setValue(band.used);
  fx.getParameter(23 * idx + 1).setValue(band.enabled);
  fx.getParameter(23 * idx + 2).setValue(band.frequency);
  fx.getParameter(23 * idx + 3).setValue(band.gain);
  fx.getParameter(23 * idx + 4).setValue(band.q);
  fx.getParameter(23 * idx + 5).setValue(band.shape);
  fx.getParameter(23 * idx + 6).setValue(band.slope);
  fx.getParameter(23 * idx + 7).setValue(band.stereo_placement);
  fx.getParameter(23 * idx + 8).setValue(band.speakers);
  fx.getParameter(23 * idx + 9).setValue(band.dynamic_range);
  fx.getParameter(23 * idx + 10).setValue(band.dynamics_enabled);
  fx.getParameter(23 * idx + 11).setValue(band.dynamics_auto);
  fx.getParameter(23 * idx + 12).setValue(band.threshold);
  fx.getParameter(23 * idx + 13).setValue(band.attack);
  fx.getParameter(23 * idx + 14).setValue(band.release);
  fx.getParameter(23 * idx + 15).setValue(band.external_side_chain);
  fx.getParameter(23 * idx + 16).setValue(band.side_chain_filtering);
  fx.getParameter(23 * idx + 17).setValue(band.side_chain_low_frequency);
  fx.getParameter(23 * idx + 18).setValue(band.side_chain_high_frequency);
  // fx.getParameter(23 * idx + 19).setValue(band.side_chain_audition);
  fx.getParameter(23 * idx + 20).setValue(band.spectral_enabled);
  fx.getParameter(23 * idx + 21).setValue(band.spectral_density);
  // fx.getParameter(23 * idx + 22).setValue(band.solo);
}

export function getBands(fx: FX, qtype: ProQType): Q3Band[] | Q4Band[] {
  switch (qtype) {
    case ProQType.Q3: {
      return getQ3Bands(fx);
    }
    case ProQType.Q4: {
      return getQ4Bands(fx);
    }
    default:
      return qtype satisfies never;
  }
}

export function convertQ3toQ4(band: Q3Band): Q4Band {
  return {
    version: 4,
    used: band.used,
    enabled: band.enabled,
    frequency: band.frequency,
    gain: band.gain,
    q: band.q,
    shape: (band.shape * 8) / 9, // NEW: p4 has a new all-pass
    slope: band.slope * 0.9 + 0.1,
    stereo_placement: band.stereo_placement,
    speakers: band.speakers,
    dynamic_range: band.dynamic_range, // set 0.5 (0.0dB) for off
    dynamics_enabled: band.dynamics_enabled, // explicitly press the power button

    dynamics_auto: band.threshold < 1.0 ? 0 : 1, // different: in q4, this is needed to enable threshold + attack + release + external_side_chain + side_chain_filtering

    threshold: band.threshold,
    attack: 0.5, // NEW
    release: 0.5, // NEW
    external_side_chain: 0, // NOTE: Available in Q3, but not in params, so this will be downgraded
    side_chain_filtering: 0, // NEW
    side_chain_low_frequency: 0.0, // NEW
    side_chain_high_frequency: 1.0, // NEW
    spectral_enabled: 0, // NEW
    spectral_density: 0.5, // NEW
  };
}

export enum Q4Feature {
  AllPass,
  AttackRelease,
  ExternalSidechain,
  SidechainFiltering,
  Spectral,
}

export function convertQ4toQ3(band: Q4Band): {
  band: Q3Band | null;
  downgraded: Set<Q4Feature>;
} {
  let downgraded: Set<Q4Feature> = new Set();

  // check for all-pass filter
  if (band.shape === 1.0) {
    // just skip this band
    downgraded.add(Q4Feature.AllPass);
    return { band: null, downgraded };
  }

  // other q4 features
  if (band.attack !== 0.5) downgraded.add(Q4Feature.AttackRelease);
  if (band.release !== 0.5) downgraded.add(Q4Feature.AttackRelease);
  if (band.external_side_chain !== 0)
    downgraded.add(Q4Feature.ExternalSidechain);
  if (band.side_chain_filtering > 0.5)
    downgraded.add(Q4Feature.SidechainFiltering);
  if (band.spectral_enabled > 0.5) downgraded.add(Q4Feature.Spectral);

  return {
    band: {
      version: 3,
      used: band.used,
      enabled: band.enabled,
      frequency: band.frequency,
      gain: band.gain,
      dynamic_range: band.dynamic_range,
      dynamics_enabled: band.dynamics_enabled,
      threshold: band.dynamics_auto > 0.5 ? 1.0 : band.threshold,
      q: band.q,
      shape: (band.shape * 9) / 8,
      slope: (band.slope - 0.1) / 0.9,
      stereo_placement: band.stereo_placement,
      speakers: band.speakers,
    },
    downgraded,
  };
}
