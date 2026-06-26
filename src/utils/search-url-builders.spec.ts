import { getUrlForCatchRoute } from './getUrlForCatchRoute';
import { getUrlForFixedRoute } from './getUrlForFixedRoute';

describe('search URL builders', () => {
  it('encodes moving-target query params and preserves padding zero', () => {
    const url = new URL(
      getUrlForCatchRoute({
        target: '65P / Gunn',
        cached: false,
        padding: 0,
        uncertainty_ellipse: true,
        start_date: '2020-01-01 00:00:00',
        stop_date: '2020-01-02 00:00:00',
        sources: ['ps1dr2', 'neat_palomar_tricam'],
      }),
    );

    expect(url.pathname).toBe('/catch');
    expect(url.searchParams.get('target')).toBe('65P / Gunn');
    expect(url.searchParams.get('cached')).toBe('false');
    expect(url.searchParams.get('padding')).toBe('0');
    expect(url.searchParams.get('uncertainty_ellipse')).toBe('true');
    expect(url.searchParams.get('start_date')).toBe('2020-01-01 00:00:00');
    expect(url.searchParams.get('stop_date')).toBe('2020-01-02 00:00:00');
    expect(url.searchParams.getAll('sources')).toEqual(['ps1dr2', 'neat_palomar_tricam']);
  });

  it('encodes fixed-target query params and preserves radius zero', () => {
    const url = new URL(
      getUrlForFixedRoute({
        ra: '177.5',
        dec: '-10.2',
        radius: 0,
        intersection_type: 'ImageIntersectsArea',
        start_date: '2002-02-22 12:00:00',
        stop_date: '2002-02-22 13:00:00',
        sources: ['skymapper_dr4', 'spacewatch'],
      }),
    );

    expect(url.pathname).toBe('/fixed');
    expect(url.searchParams.get('ra')).toBe('177.5');
    expect(url.searchParams.get('dec')).toBe('-10.2');
    expect(url.searchParams.get('radius')).toBe('0');
    expect(url.searchParams.get('intersection_type')).toBe('ImageContainsArea');
    expect(url.searchParams.get('start_date')).toBe('2002-02-22 12:00:00');
    expect(url.searchParams.get('stop_date')).toBe('2002-02-22 13:00:00');
    expect(url.searchParams.getAll('sources')).toEqual(['skymapper_dr4', 'spacewatch']);
  });
});
