export function isTruthy(val: unknown): boolean {
  return val === true || val === 'true' || val === '1' || val === 1
}

/**
 * Whether telemetry is disabled by the `DO_NOT_TRACK` convention.
 * @see https://donottrack.sh/
 */
export function isDoNotTrack(env: Record<string, unknown> = process.env): boolean {
  return isTruthy(env.DO_NOT_TRACK)
}
