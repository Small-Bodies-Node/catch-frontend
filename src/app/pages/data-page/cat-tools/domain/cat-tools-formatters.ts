import { ICatResponseCache } from '../../../../../models/ICatResponseCache';
import { ICatToolsDatumRow, TApiDatum } from './cat-tools.types';

export function formatDatumValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(6);
  }

  return value;
}

export function formatRowDate(date: string): string {
  return date.split('.')[0];
}

export function getCacheRows(cache: ICatResponseCache | undefined): ICatToolsDatumRow[] {
  return [
    { label: 'Cache status', value: getCacheStatusLabel(cache) },
    ...(cache?.error ? [{ label: 'Cache warning', value: cache.error }] : []),
  ];
}

export function getCacheStatusLabel(cache: ICatResponseCache | undefined): string {
  if (!cache) {
    return 'Cache status unavailable';
  }

  if (!cache.enabled) {
    return 'Backend cache disabled';
  }

  return cache.hit ? 'Cached result' : 'Fresh result';
}

export function roundPixelCoordinate(value: unknown, fallback = 0): number {
  return isFiniteNumber(value) ? Math.round(value) : fallback;
}

export function roundOptionalPixelCoordinate(value: unknown): number | undefined {
  return isFiniteNumber(value) ? Math.round(value) : undefined;
}

export function roundPixelPosition(position: [number, number]): [number, number] {
  return [roundPixelCoordinate(position[0]), roundPixelCoordinate(position[1])];
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function isOptionalFiniteNumber(value: unknown): boolean {
  return value === null || value === undefined || value === '' || isFiniteNumber(value);
}

export function getNumberFromDatumOrCutoutUrl(
  apiDatum: TApiDatum,
  key: 'ra' | 'dec',
): number | null {
  return getOptionalNumber(apiDatum, key) ?? getNumberFromUrl(apiDatum.cutout_url, key);
}

function getOptionalNumber(apiDatum: TApiDatum, key: string): number | null {
  const value = (apiDatum as unknown as Record<string, unknown>)[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function getNumberFromUrl(url: string | null, key: string): number | null {
  if (!url) {
    return null;
  }

  try {
    const value = new URL(url, 'http://localhost').searchParams.get(key);
    const numberValue = value === null ? NaN : Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  } catch {
    return null;
  }
}
