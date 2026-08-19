import { IPhotometricCalibrationResult } from '../../../../../models/IPhotometricCalibrationRun';
import { ITargetPhotometryResponse } from '../../../../../models/ITargetPhotometry';
import { isFiniteNumber } from './cat-tools-formatters';

export interface ISourceMagnitudeInputs {
  sourceColor: number | null;
  targetPhotometryResult: ITargetPhotometryResponse;
  photometricCalibrationResult: IPhotometricCalibrationResult;
}

export type TSourceMagnitudeResult =
  | {
      success: true;
      sourceColor: number;
      magnitude: number;
      magnitudeUncertainty: number;
    }
  | {
      success: false;
      error: string;
    };

export function calculateSourceMagnitude(inputs: ISourceMagnitudeInputs): TSourceMagnitudeResult {
  const apertureFlux = inputs.targetPhotometryResult.aperture_flux;
  const apertureFluxError = inputs.targetPhotometryResult.aperture_fluxerr;
  const zeroPoint = inputs.photometricCalibrationResult.photometry.zero_point;
  const zeroPointUncertainty = inputs.photometricCalibrationResult.photometry.uncertainty;
  const colorTermCoefficient = inputs.photometricCalibrationResult.photometry.color_term;
  const sourceColor = inputs.sourceColor;

  if (!isFiniteNumber(sourceColor)) {
    return failure('Source color is required and must be a finite number.');
  }

  if (!isFiniteNumber(apertureFlux) || apertureFlux <= 0) {
    return failure('Aperture flux must be a finite number greater than zero.');
  }

  if (!isFiniteNumber(apertureFluxError) || apertureFluxError < 0) {
    return failure('Aperture flux error must be a finite, nonnegative number.');
  }

  if (
    !isFiniteNumber(zeroPoint) ||
    !isFiniteNumber(zeroPointUncertainty) ||
    !isFiniteNumber(colorTermCoefficient)
  ) {
    return failure('Photometric calibration values are incomplete or invalid.');
  }

  const magnitude =
    -2.5 * Math.log10(apertureFlux) + zeroPoint + sourceColor * colorTermCoefficient;
  const magnitudeUncertainty = Math.sqrt(
    zeroPointUncertainty ** 2 + ((1.0857 * apertureFluxError) / apertureFlux) ** 2,
  );

  if (!isFiniteNumber(magnitude) || !isFiniteNumber(magnitudeUncertainty)) {
    return failure('The calibrated magnitude could not be calculated from these values.');
  }

  return { success: true, sourceColor, magnitude, magnitudeUncertainty };
}

function failure(error: string): TSourceMagnitudeResult {
  return { success: false, error };
}
