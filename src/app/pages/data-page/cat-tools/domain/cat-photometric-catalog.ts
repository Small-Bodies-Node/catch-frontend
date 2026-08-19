import {
  IPhotometricCalibrationInputs,
  TPhotometricCalibrationBand,
  TPhotometricCalibrationCatalog,
} from '../../../../../models/IPhotometricCalibrationRun';

export interface IPhotometricCalibrationCatalogConfiguration {
  readonly bands: readonly TPhotometricCalibrationBand[];
  readonly defaultBand: TPhotometricCalibrationBand;
  readonly defaultColorTerm: string;
}

const configurations: Readonly<
  Record<TPhotometricCalibrationCatalog, IPhotometricCalibrationCatalogConfiguration>
> = {
  PanSTARRS1: {
    bands: ['g', 'r', 'i', 'z', 'y'],
    defaultBand: 'r',
    defaultColorTerm: 'g-r',
  },
  Gaia: {
    bands: ['G', 'bp', 'rp'],
    defaultBand: 'G',
    defaultColorTerm: 'bp-rp',
  },
  SkyMapper: {
    bands: ['u', 'v', 'g', 'r', 'i', 'z'],
    defaultBand: 'r',
    defaultColorTerm: 'g-r',
  },
};

export function getPhotometricCalibrationCatalogConfiguration(
  catalog: TPhotometricCalibrationCatalog,
): IPhotometricCalibrationCatalogConfiguration {
  return configurations[catalog];
}

export function isPhotometricCalibrationBandSupported(
  catalog: TPhotometricCalibrationCatalog,
  band: string,
): band is TPhotometricCalibrationBand {
  return getPhotometricCalibrationCatalogConfiguration(catalog).bands.some(
    (supportedBand) => supportedBand === band,
  );
}

export function isPhotometricCalibrationColorTermSupported(
  catalog: TPhotometricCalibrationCatalog,
  colorTerm: string,
): boolean {
  const [firstBand, secondBand, ...extraBands] = colorTerm.trim().split('-');
  return (
    extraBands.length === 0 &&
    firstBand !== secondBand &&
    isPhotometricCalibrationBandSupported(catalog, firstBand) &&
    isPhotometricCalibrationBandSupported(catalog, secondBand)
  );
}

export function reconcilePhotometricCalibrationCatalog(
  inputs: IPhotometricCalibrationInputs,
  catalog: TPhotometricCalibrationCatalog,
): IPhotometricCalibrationInputs {
  const configuration = getPhotometricCalibrationCatalogConfiguration(catalog);
  return {
    ...inputs,
    catalog,
    cal_band: isPhotometricCalibrationBandSupported(catalog, inputs.cal_band)
      ? inputs.cal_band
      : configuration.defaultBand,
    color_term: isPhotometricCalibrationColorTermSupported(catalog, inputs.color_term)
      ? inputs.color_term
      : configuration.defaultColorTerm,
  };
}
