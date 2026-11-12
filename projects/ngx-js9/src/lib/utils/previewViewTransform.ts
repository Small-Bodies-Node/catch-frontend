interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

/** Preserve the fitted magnification and pan when preview and FITS have different canvases. */
export function previewViewTransform(
  image: Size,
  display: Size,
  preview: Size,
  imageToDisplay: (point: Point) => Point,
): string {
  if (
    ![
      image.width,
      image.height,
      display.width,
      display.height,
      preview.width,
      preview.height,
    ].every((value) => Number.isFinite(value) && value > 0)
  )
    return 'none';

  const displayFit = Math.min(display.width / image.width, display.height / image.height);
  const previewFit = Math.min(preview.width / image.width, preview.height / image.height);
  const ratio = previewFit / displayFit;
  const offsetX = (preview.width - image.width * previewFit) / 2;
  const offsetY = (preview.height - image.height * previewFit) / 2;
  const origin = imageToDisplay({ x: 0.5, y: image.height + 0.5 });
  const x = imageToDisplay({ x: 1.5, y: image.height + 0.5 });
  const y = imageToDisplay({ x: 0.5, y: image.height - 0.5 });
  const a = (x.x - origin.x) / displayFit;
  const b = (x.y - origin.y) / displayFit;
  const c = (y.x - origin.x) / displayFit;
  const d = (y.y - origin.y) / displayFit;
  const tx =
    preview.width / 2 + (origin.x + 0.5 - display.width / 2) * ratio - a * offsetX - c * offsetY;
  const ty =
    preview.height / 2 + (origin.y + 0.5 - display.height / 2) * ratio - b * offsetX - d * offsetY;
  return `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;
}
