export interface ISourceMagnitudeCalculation {
  productId: string;
  astrometryRunId: string;
  photometricCalibrationRunId: string;
  centroidRunId: string;
  targetPhotometryRunId: string;
  sourceColor: number;
  magnitude: number;
  magnitudeUncertainty: number;
  calculatedAt: string;
}

export type TSourceMagnitudeState = {
  [productId: string]: {
    [astrometryRunId: string]: {
      [photometricCalibrationRunId: string]: {
        [centroidRunId: string]: {
          [targetPhotometryRunId: string]: ISourceMagnitudeCalculation;
        };
      };
    };
  };
};
