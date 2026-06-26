export type TCatShareView = 'astrometry-inputs';

export interface ICatShareIntent {
  productId: string;
  view: TCatShareView;
}

export const catShareQueryParamNames = {
  enabled: 'cat',
  productId: 'cat_product_id',
  view: 'cat_view',
} as const;

const defaultCatShareView: TCatShareView = 'astrometry-inputs';

export function getCatShareQueryParams(productId: string): Record<string, string> {
  return {
    [catShareQueryParamNames.enabled]: '1',
    [catShareQueryParamNames.productId]: productId,
    [catShareQueryParamNames.view]: defaultCatShareView,
  };
}

export function parseCatShareIntent(queryParams: Record<string, unknown>): ICatShareIntent | null {
  const enabled = getOptionalString(queryParams[catShareQueryParamNames.enabled]);
  if (enabled !== '1' && enabled?.toLowerCase() !== 'true') {
    return null;
  }

  const productId = getOptionalString(queryParams[catShareQueryParamNames.productId]);
  if (!productId) {
    return null;
  }

  const view = getOptionalString(queryParams[catShareQueryParamNames.view]);
  return {
    productId,
    view: view === defaultCatShareView ? view : defaultCatShareView,
  };
}

function getOptionalString(value: unknown): string | undefined {
  const firstValue = Array.isArray(value) ? value[0] : value;
  if (firstValue === null || firstValue === undefined) {
    return undefined;
  }

  const trimmedValue = String(firstValue).trim();
  return trimmedValue ? trimmedValue : undefined;
}
