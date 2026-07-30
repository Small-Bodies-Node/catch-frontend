import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CatApiService } from './cat-api.service';

describe('CatApiService', () => {
  let service: CatApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CatApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('posts the exact separated astrometry payload and receives wcs_image_url', () => {
    const payload = {
      image_url: 'https://example.test/input.fits',
      ra: 12.3,
      dec: -4.5,
      use_ra_dec: true as const,
      pixel_scale: 0.25,
      scale_low: null,
      scale_high: null,
      search_radius: 2,
      snr_threshold: 3,
    };
    let wcsImageUrl = '';

    service.fetchAstrometry(payload).subscribe((result) => {
      wcsImageUrl = result.wcs_image_url;
    });

    const request = httpTesting.expectOne('/api/cat/calibration/astrometry');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    expect(request.request.body).not.toEqual(
      jasmine.objectContaining({ photometry: jasmine.anything() }),
    );
    request.flush({
      status: 'success',
      wcs_image_url: 'https://example.test/wcs.fits',
      wcs_image_s3_key: 'wcs.fits',
      sources_detected: 12,
      center_ra_deg: 12.3,
      center_dec_deg: -4.5,
      pixel_scale: 0.25,
      request_id: 'request-1',
      cache: { enabled: false, hit: false, key: null },
    });

    expect(wcsImageUrl).toBe('https://example.test/wcs.fits');
  });

  it('posts Stage 2 with wcs_image_url and color_term but never obs_band', () => {
    const payload = {
      wcs_image_url: 'https://example.test/wcs.fits',
      snr_threshold: 3,
      aperture_radius: 7,
      catalog: 'PanSTARRS1' as const,
      cal_band: 'r',
      color_term: 'g-r',
    };

    service.fetchPhotometricCalibration(payload).subscribe();

    const request = httpTesting.expectOne('/api/cat/calibration/photometry');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    expect(request.request.body['obs_band']).toBeUndefined();
    request.flush({
      status: 'success',
      photometry: {
        zero_point: 25,
        color_term: 0.1,
        uncertainty: 0.02,
        color_index: 'g-r',
        catalog: 'PanSTARRS1',
        cal_band: 'r',
      },
      sources: { detected: 12, matched: 10 },
      photometry_image_url: 'https://example.test/photometry.fits',
      photometry_image_s3_key: 'photometry.fits',
      plots: {
        color_correction: { url: 'https://example.test/color.png', s3_key: 'color.png' },
        image_overlay: { url: 'https://example.test/overlay.png', s3_key: 'overlay.png' },
      },
      request_id: 'request-2',
      cache: { enabled: true, hit: false, key: 'cache-key' },
    });
  });
});
