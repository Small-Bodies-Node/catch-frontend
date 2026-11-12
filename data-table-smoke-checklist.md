# Data Table Smoke Checklist

- Load `/data` and confirm the table renders rows and thumbnails.
- Click several different rows and confirm the selected-row highlight moves and the viewer panel updates.
- Sort by at least two columns and confirm row order changes without losing selection.
- Toggle a single download checkbox and confirm only that row's checkbox changes.
- Toggle the header download checkbox and confirm it selects or clears every row in the current result set.
- Check several download rows individually and confirm the header checkbox shows the partial-selection state.
- Open column settings, hide a few columns, then re-enable them and confirm the table updates correctly.
- Confirm rows with missing thumbnails show the placeholder instead of a spinner that never ends.
- Use keyboard up/down on a focused row and confirm selection moves within the visible page.
- With a large result set (for example, 4,800 results), confirm First/Last and the submitted Page number update the table, selected row, and viewer together.
- Type a page number without submitting and confirm it does not navigate; verify empty, fractional, zero, and out-of-range page numbers are rejected.
- Rapidly navigate through several pages with browser network throttling enabled. Confirm obsolete thumbnail requests are canceled and queued images from skipped pages never start.
- Repeat after sorting, filtering, changing page size, and navigating away from `/data`. Confirm only current-page thumbnails remain requested and empty results disable page entry.
- Return to a previously loaded page and confirm completed thumbnails use the cache. Begin an image download before changing pages and confirm it completes.
