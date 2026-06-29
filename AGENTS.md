# Repository Instructions

## Project Goal

Build an npm-workspaces SPFx monorepo using SharePoint Framework. The repo will contain independent SPFx projects and one (or more) plain shared TypeScript package.

## Required Structure

```text
packages/
  simple-web-part/
  header-application-customizer/
  list-view-command-set/
  shared/
```

## Tech Stack

- SharePoint Framework: `1.23.0`
- SPFx Yeoman generator: `@microsoft/generator-sharepoint@1.23.0`
- Node.js: `>=22.14.0 <23.0.0`
- npm: `10.9.8`
- Package manager declaration: `packageManager: npm@10.9.8`
- React (see appropriate versions from https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility#spfx-development-environment-compatibility)

## Working Rules

- Work in phases and pause after each phase for review and commit.
- After each round of changes, review `AGENTS.md` and `/docs` for updates before reporting back.
- Use npm workspaces.
- Keep version numbers centralized in this file's Tech Stack section when documenting project intent. Implementation files may still need exact versions.
- Use the official SPFx Yeoman generator for all SPFx project scaffolding.
- Keep each SPFx project as an independent solution that produces its own `.sppkg`.
- Do not add dependencies between SPFx packages.  Only non-SPFx code may be shared and used by SPFx solutions.

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

When SPFx or shared packages exist, also run the narrowest relevant build command for the changed workspace before pausing for review.

## Prepare changes

Before asking the user to review or commit a completed phase:

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
