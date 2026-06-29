# SPFx Monorepo Plan

This repo uses npm workspaces for a simple SPFx monorepo. Each SPFx project will remain an independent solution package and produce its own `.sppkg`.

Shared code will live in a plain workspace package and will be imported by SPFx source code, then bundled into each consuming SPFx solution. The SPFx packages must not depend on each other.

## Planned Workspace Layout

```text
packages/
  simple-web-part/
  header-application-customizer/
  list-view-command-set/
  shared/
```

## Build Phases

1. Monorepo scaffold.
2. Simple React web part.
3. React header application customizer.
4. React List View Command Set.
5. Shared TypeScript package consumed by each SPFx project.

Pause after each phase for review and commit.

## Verification Note

When using Codex, run SPFx install, build, and package verification outside the sandbox. The SPFx Heft/Sass toolchain can fail inside the macOS sandbox even when the generated project is valid.

## SPFx Constraints

- Use the SharePoint Framework version listed in the Tech Stack section of `AGENTS.md`.
- Use the official SPFx Yeoman generator for SPFx project creation.
- Use React for each SPFx project.
- Keep each SPFx project deployable as its own `.sppkg`.
- Do not configure tenant-wide deployment by default.
- Do not create an SPFx library component for shared code.
- Revisit Heft vs plain `tsc` before implementing the shared package.
