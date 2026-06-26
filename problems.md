# Problems To Work Through

- [x] Add a rollback checkpoint for `/data` work: create a clean checkpoint commit and a short smoke-test checklist before major refactors.
- [ ] Add minimal test coverage for the `/data` view: cover table selection, FITS/JPEG toggle, column visibility, and tabbed viewer behavior.
- [x] Fix the `TableDataCheckboxesComponent` polling leak and lifecycle cleanup.
- [x] Fix Pan-STARRS overlay request races so stale responses cannot overwrite newer selection state.
- [ ] Refactor `TableDataComponent` into smaller responsibilities: table state/view model, selection/navigation, column config, and rendering helpers.
- [x] Remove dead or misleading table plumbing such as the no-op `rerenderTable()` and dead thumbnail output wiring.
- [ ] Tighten table keyboard and accessibility behavior so only intended keys are intercepted and focus handling is predictable.
- [ ] Simplify duplicated NgRx fetch result shaping in `api-data.effects.ts` and move more page shaping into selectors or dedicated view-model helpers.
- [ ] Clean general `/data` layout hygiene: remove hidden debug markup, tighten mobile-only rendering, and clarify ownership between layout shells and content panels.
- [ ] Later, if `/data` becomes live-updating, remove one-shot `take(1)` snapshots from widgets like `TitleDataComponent` and `SolarViewerComponent`.
- [x] Design and implement the compact versus expanded table drawer mode on top of the cleaned-up table architecture for desktop.
