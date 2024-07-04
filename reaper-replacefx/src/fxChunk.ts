import { getLastTouchedFx } from "./lastFocusedFx";
import { Ok, newErr } from "./result";

export const NoFocusedFX = newErr("NoFocusedFX");
export const FXHasNoChunk = newErr("FXHasNoChunk");
export const FailedToGetFXChunk = newErr("FailedToGetFXChunk");
export const FailedToSetFXChunk = newErr("FailedToSetFXChunk");

export function getLastTouchedFxChunk() {
  const fx = getLastTouchedFx();
  if (fx === null) return NoFocusedFX;

  const fxType = fx.GetNamedConfigParm("fx_type")?.toUpperCase() || null;
  if (fxType === null) return FailedToGetFXChunk;

  let chunk: string | null = null;
  if (fxType.includes("VST")) {
    chunk = fx.GetNamedConfigParm("vst_chunk");
  } else if (fxType.includes("CLAP")) {
    chunk = fx.GetNamedConfigParm("clap_chunk");
  } else {
    return FXHasNoChunk;
  }

  if (chunk === null) return FailedToGetFXChunk;

  return Ok(chunk);
}

export function setLastTouchedFxChunk(chunk: string) {
  const fx = getLastTouchedFx();
  if (fx === null) return NoFocusedFX;

  const fxType = fx.GetNamedConfigParm("fx_type")?.toUpperCase() || null;
  if (fxType === null) return FailedToGetFXChunk;

  let success: boolean;
  if (fxType.includes("VST")) {
    success = fx.SetNamedConfigParm("vst_chunk", chunk);
  } else if (fxType.includes("CLAP")) {
    success = fx.SetNamedConfigParm("clap_chunk", chunk);
  } else {
    return FXHasNoChunk;
  }

  if (!success) return FailedToSetFXChunk;

  return Ok(fx);
}
