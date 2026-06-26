import { TApiDataSearch } from '../../../models/TApiDataSearch';
import {
  controlKeysForSources,
  TControlKeyForSources,
} from '../../../models/TControlKeyForSources';
import { intersectionTypes, TIntersectionType } from '../../../models/TIntersectionType';

export type TDataRouteQueryParams = Record<string, unknown>;

export type TDataRouteQueryParseResult =
  | {
      ok: true;
      search: TApiDataSearch;
    }
  | {
      ok: false;
      message: string;
    };

const validSources = new Set<string>(controlKeysForSources);
const validIntersectionTypes = new Set<string>(intersectionTypes);

export function parseDataRouteQueryParams(
  queryParams: TDataRouteQueryParams,
): TDataRouteQueryParseResult {
  const sourcesResult = parseSources(queryParams['sources']);
  if (!sourcesResult.ok) return sourcesResult;

  const cachedResult = parseOptionalBoolean(queryParams['cached'], true, 'cached');
  if (!cachedResult.ok) return cachedResult;

  const uncertaintyEllipseResult = parseOptionalBoolean(
    queryParams['uncertainty_ellipse'],
    false,
    'uncertainty_ellipse',
  );
  if (!uncertaintyEllipseResult.ok) return uncertaintyEllipseResult;

  const paddingResult = parseOptionalNumber(queryParams['padding'], 'padding');
  if (!paddingResult.ok) return paddingResult;

  const radiusResult = parseOptionalNumber(queryParams['radius'], 'radius');
  if (!radiusResult.ok) return radiusResult;

  const intersectionTypeResult = parseIntersectionType(queryParams['intersection_type']);
  if (!intersectionTypeResult.ok) return intersectionTypeResult;

  const target = getOptionalString(queryParams['target']);
  const startDate = getOptionalString(queryParams['start_date']);
  const stopDate = getOptionalString(queryParams['stop_date']);

  if (target) {
    return {
      ok: true,
      search: {
        searchType: 'moving',
        searchParams: {
          target,
          cached: cachedResult.value,
          uncertainty_ellipse: uncertaintyEllipseResult.value,
          padding: paddingResult.value,
          start_date: startDate,
          stop_date: stopDate,
          sources: sourcesResult.sources,
        },
      },
    };
  }

  const ra = getOptionalString(queryParams['ra']);
  const dec = getOptionalString(queryParams['dec']);

  if (ra && dec) {
    return {
      ok: true,
      search: {
        searchType: 'fixed',
        searchParams: {
          ra,
          dec,
          radius: radiusResult.value,
          intersection_type: intersectionTypeResult.intersectionType,
          start_date: startDate,
          stop_date: stopDate,
          sources: sourcesResult.sources,
        },
      },
    };
  }

  return {
    ok: false,
    message: 'The /data route requires either a moving target or fixed RA and Dec coordinates.',
  };
}

function getOptionalString(value: unknown): string | undefined {
  const firstValue = getFirstQueryParamValue(value);
  const trimmedValue = firstValue?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function getFirstQueryParamValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return getFirstQueryParamValue(value[0]);
  }

  if (value === null || value === undefined) {
    return undefined;
  }

  return String(value);
}

function getAllQueryParamValues(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => getFirstQueryParamValue(entry)).filter(isDefined);
  }

  const firstValue = getFirstQueryParamValue(value);
  return firstValue === undefined ? [] : [firstValue];
}

function parseOptionalBoolean(
  value: unknown,
  defaultValue: boolean,
  label: string,
): { ok: true; value: boolean } | { ok: false; message: string } {
  const rawValue = getOptionalString(value);
  if (rawValue === undefined) {
    return { ok: true, value: defaultValue };
  }

  if (rawValue === 'true') {
    return { ok: true, value: true };
  }

  if (rawValue === 'false') {
    return { ok: true, value: false };
  }

  return {
    ok: false,
    message: `The ${label} query parameter must be "true" or "false".`,
  };
}

function parseOptionalNumber(
  value: unknown,
  label: string,
): { ok: true; value: number | undefined } | { ok: false; message: string } {
  const rawValue = getOptionalString(value);
  if (rawValue === undefined) {
    return { ok: true, value: undefined };
  }

  const numericValue = Number(rawValue);
  if (Number.isFinite(numericValue)) {
    return { ok: true, value: numericValue };
  }

  return {
    ok: false,
    message: `The ${label} query parameter must be a finite number.`,
  };
}

function parseIntersectionType(
  value: unknown,
): { ok: true; intersectionType: TIntersectionType | undefined } | { ok: false; message: string } {
  const intersectionType = getOptionalString(value);
  if (intersectionType === undefined) {
    return { ok: true, intersectionType: undefined };
  }

  if (validIntersectionTypes.has(intersectionType)) {
    return {
      ok: true,
      intersectionType: intersectionType as TIntersectionType,
    };
  }

  return {
    ok: false,
    message: `The intersection_type query parameter must be one of: ${intersectionTypes.join(', ')}.`,
  };
}

function parseSources(
  value: unknown,
): { ok: true; sources: TControlKeyForSources[] } | { ok: false; message: string } {
  const sources = getAllQueryParamValues(value).filter((source) => source.trim().length > 0);
  const invalidSource = sources.find((source) => !validSources.has(source));

  if (invalidSource) {
    return {
      ok: false,
      message: `The sources query parameter contains an unknown source: ${invalidSource}.`,
    };
  }

  return {
    ok: true,
    sources: sources as TControlKeyForSources[],
  };
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
