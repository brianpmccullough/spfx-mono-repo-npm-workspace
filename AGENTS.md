# Repository Instructions

## Project Goal

Build an npm-workspaces SPFx monorepo using SharePoint Framework. The repo contains independent SPFx projects and one (or more) plain shared TypeScript packages, all installed into a single hoisted root `node_modules`.

`README.md` is the setup walkthrough for people; keep it in sync when the workspace setup changes.

## Required Structure

```text
packages/
  webpart-1/                 # SPFx web part
  webpart-2/                 # SPFx web part
  application-customizer/    # SPFx application customizer
  command-set/               # SPFx list view command set
  shared/                    # @spfxmonorepo/shared, plain TypeScript
```

## Tech Stack

- SharePoint Framework: `1.23.2`
- SPFx Yeoman generator: `@microsoft/generator-sharepoint@1.23.2`
- Node.js: `>=22.14.0 <23.0.0`
- npm: `10.9.8`
- TypeScript: `~5.8.0` (SPFx projects and `shared`)
- React: `17.0.1` (see appropriate versions from https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility#spfx-development-environment-compatibility)

## Working Rules

- Work in small, incremental steps and pause after each one for review and commit. The repo is a learning exercise; each commit should be one verified change.
- After each round of changes, review `AGENTS.md` and `/docs` for updates before reporting back.
- In Codex, run install, generator, build, package, git write, and network-dependent commands outside the sandbox using escalation. The SPFx toolchain uses native/runtime probes such as `sass-embedded` that can fail inside the macOS sandbox even when the project is correct.
- Use npm workspaces. Run `npm install` only from the repo root; there is one root `package-lock.json` and no per-project lockfiles.
- Keep dependencies hoisted in the root `node_modules`. Do not use `install-strategy=nested` or other per-project installs to work around hoisting issues; fix the config paths instead.
- Keep version numbers centralized in this file's Tech Stack section when documenting project intent. Implementation files may still need exact versions.
- Use the official SPFx Yeoman generator for all SPFx project scaffolding.
- Keep each SPFx project as an independent solution that produces its own `.sppkg`.
- Do not add dependencies between SPFx packages.  Only non-SPFx code may be shared and used by SPFx solutions.
- Shared code lives in `@spfxmonorepo/shared`: a private, plain TypeScript package built with `tsc` from `src` to `lib`, never an SPFx library component. SPFx projects depend on it with `"@spfxmonorepo/shared": "*"`.
- Root scripts delegate to each workspace's own scripts with `npm run <script> -w <workspace>`. Do not copy Heft commands into the root `package.json`.

## Adding An SPFx Project

1. Generate it with the official SPFx Yeoman generator in its own folder under `packages/`.
2. Remove any `node_modules` or `package-lock.json` the generator created inside the project.
3. Replace its `tsconfig.json` so the rig resolves from the hoisted root `node_modules`:

   ```json
   {
     "extends": "@microsoft/spfx-web-build-rig/profiles/default/tsconfig-base.json",
     "compilerOptions": {
       "outDir": "lib",
       "rootDir": "src",
       "rootDirs": ["src", "temp/loc-ts", "temp/sass-ts", "temp/static-asset-ts"],
       "typeRoots": ["./node_modules/@types", "../../node_modules/@types"]
     },
     "include": ["src/**/*.ts", "src/**/*.tsx"]
   }
   ```

4. Add `"@spfxmonorepo/shared": "*"` to its `dependencies` if it uses shared code.
5. Add root `<project>:build`, `<project>:clean`, and `<project>:start` scripts. `build` and `start` run `npm run shared:build` first.
6. Run `npm install` from the repo root, then `npm run <project>:build`.

## Verify Agent Changes

Run these commands after each agent change:

```sh
sed -n '1,260p' AGENTS.md
find docs -maxdepth 3 -type f
node -v
npm -v
npm pkg get workspaces
rg -n "[0-9]+\.[0-9]+|22|23|1\.23|10\.9" README.md docs
git status --short
```

The README/docs version search should return no results unless a plan intentionally references a version. Keep project-intent version numbers in the Tech Stack section of this file.

When SPFx or shared packages exist, also run the narrowest relevant build command for the changed workspace before pausing for review. In Codex, run that build outside the sandbox.

## Prepare changes

Before asking the user to review or commit a completed step:

1. Check the current branch:

   ```sh
   git branch --show-current
   git status --short
   ```

2. If the repo is still on `main`, ask before creating a branch. Use the `[fix|feat|docs]/[user initials]/[very-brief-description]` prefix and a short phase-focused name, for example:

   ```sh
   git switch -c feat/bpm/monorepo-scaffold
   ```

3. Review the actual changed files before proposing a commit:

   ```sh
   git diff --stat
   git diff -- README.md AGENTS.md docs package.json package-lock.json .gitignore
   ```

4. Prepare a commit message and description based only on the changes made. Use an imperative subject line and a concise body:

   ```text
   Scaffold npm SPFx monorepo

   - Add root npm workspace configuration
   - Document phased SPFx monorepo plan
   - Add agent instructions for version and review discipline
   ```

5. Do not stage or commit unless the user explicitly asks for it. If staging or committing succeeds, report the exact files staged and the final commit subject.
