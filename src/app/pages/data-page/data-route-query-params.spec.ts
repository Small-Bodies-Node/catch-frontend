import { parseDataRouteQueryParams } from './data-route-query-params';

describe('parseDataRouteQueryParams', () => {
  it('parses moving-target route params', () => {
    const result = parseDataRouteQueryParams({
      target: '65P',
      cached: 'false',
      uncertainty_ellipse: 'true',
      padding: '3.5',
      start_date: '2020-01-01 00:00:00',
      stop_date: '2020-01-02 00:00:00',
      sources: ['ps1dr2', 'skymapper_dr4'],
    });

    expect(result).toEqual({
      ok: true,
      search: {
        searchType: 'moving',
        searchParams: {
          target: '65P',
          cached: false,
          uncertainty_ellipse: true,
          padding: 3.5,
          start_date: '2020-01-01 00:00:00',
          stop_date: '2020-01-02 00:00:00',
          sources: ['ps1dr2', 'skymapper_dr4'],
        },
      },
    });
  });

  it('uses moving-target defaults for optional booleans', () => {
    const result = parseDataRouteQueryParams({ target: '65P' });

    expect(result).toEqual({
      ok: true,
      search: {
        searchType: 'moving',
        searchParams: {
          target: '65P',
          cached: true,
          uncertainty_ellipse: false,
          padding: undefined,
          start_date: undefined,
          stop_date: undefined,
          sources: [],
        },
      },
    });
  });

  it('parses fixed-target route params while preserving sexagesimal coordinates', () => {
    const result = parseDataRouteQueryParams({
      ra: '05:34:32.0',
      dec: '+22:00:48',
      radius: '8',
      intersection_type: 'ImageIntersectsArea',
      sources: 'spacewatch',
    });

    expect(result).toEqual({
      ok: true,
      search: {
        searchType: 'fixed',
        searchParams: {
          ra: '05:34:32.0',
          dec: '+22:00:48',
          radius: 8,
          intersection_type: 'ImageIntersectsArea',
          start_date: undefined,
          stop_date: undefined,
          sources: ['spacewatch'],
        },
      },
    });
  });

  it('prefers moving-target params when target and fixed coordinates are both present', () => {
    const result = parseDataRouteQueryParams({
      target: '65P',
      ra: '1',
      dec: '2',
    });

    expect(result.ok).toBeTrue();
    if (result.ok) {
      expect(result.search.searchType).toBe('moving');
    }
  });

  it('rejects invalid booleans, numbers, intersection types, sources, and missing search shape', () => {
    expect(parseDataRouteQueryParams({ target: '65P', cached: 'yes' }).ok).toBeFalse();
    expect(parseDataRouteQueryParams({ target: '65P', padding: 'wide' }).ok).toBeFalse();
    expect(
      parseDataRouteQueryParams({
        ra: '1',
        dec: '2',
        intersection_type: 'InvalidIntersection',
      }).ok,
    ).toBeFalse();
    expect(parseDataRouteQueryParams({ target: '65P', sources: 'unknown_source' }).ok).toBeFalse();
    expect(parseDataRouteQueryParams({ ra: '1' }).ok).toBeFalse();
  });
});
