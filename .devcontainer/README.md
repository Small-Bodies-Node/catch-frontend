# Development container

This project uses `master-vscode-devcontainer:latest` in the fixed container
name `catch-frontend-ng20`. The application is not started automatically.

Two project-specific volumes persist across rebuilds:

- `catch-frontend-ng20-codex` preserves Codex chats and configuration at
  `/home/vscode/.codex`.
- `catch-frontend-ng20-node-modules` keeps Linux dependencies separate from the
  macOS checkout's platform-specific packages. `npm ci` refreshes it when the
  container is created.

Rebuilding does not clear `catch-frontend-ng20-node-modules`. For a completely
clean dependency installation, first remove every container that references
it, then remove that exact volume only after deletion has been explicitly
approved.

Package-manager caches, Claude state, VS Code Server binaries, and remote
extension installations are disposable. VS Code may separately mount its
application-managed global `vscode` volume at `/vscode`; it is not declared by
this project.

## Codex extension reliability

If the Codex extension loads unreliably, run this manually inside the
devcontainer:

```bash
codex features disable remote_plugin
```

This local workaround has materially improved Codex extension loading in these
devcontainers, although it is not a complete fix. The command should set
`remote_plugin = false` under `[features]` in
`/home/vscode/.codex/config.toml`.

Do not put this command in `postCreateCommand`, `postStartCommand`, or another
automatic lifecycle hook. After rebuilding, verify that the setting survived
in the project-specific Codex volume. If it disappeared, report that as a
persistence problem instead of hiding it with startup automation.
