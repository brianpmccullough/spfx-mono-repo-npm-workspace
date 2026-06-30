# spfx-mono-repo-npm-workspace

Exploring how to build an SPFx monorepo with multiple SPFx packages/projects/solutions in a single repository using npm workspaces. Goals include simplifying SPFx version upgrades and sharing resources.

See [docs/plans/spfx-monorepo-plan.md](docs/plans/spfx-monorepo-plan.md) for the current build plan.

## Workspace Layout

This repository uses npm workspaces to manage multiple independent SPFx solutions and one shared TypeScript package.

```text
packages/
  simple-web-part/                 # SPFx web part solution
  header-application-customizer/    # SPFx application customizer solution
  list-view-command-set/            # SPFx list view command set solution
  shared/                           # Plain TypeScript shared utilities
```

Each SPFx package produces its own `.sppkg`. The shared package is not an SPFx library component and is bundled into each consuming SPFx solution.

## How The Workspace Fits Together

The root `package.json` declares the npm workspace:

```json
"workspaces": [
  "packages/*"
]
```

Running `npm install` from the repository root creates one root `package-lock.json`, installs compatible dependencies into the root `node_modules`, and symlinks each workspace package from root `node_modules`.

Each SPFx project still keeps its own `package.json`. That is intentional: each SPFx package is an independent solution with its own build and deployment boundary. npm workspaces centralize installation and linking; they do not remove the need for each workspace package to declare the dependencies it directly uses.

The shared package is connected to each SPFx package through a workspace file dependency:

```json
"@spfx-monorepo/shared": "file:../shared"
```

The shared package compiles TypeScript from `src` into `lib`. Its `package.json` points consumers at the compiled output:

```json
"main": "lib/index.js",
"types": "lib/index.d.ts"
```

The SPFx packages import from `@spfx-monorepo/shared`; during SPFx builds, that shared code is bundled into each consuming `.sppkg`. There is no separate shared `.sppkg`.

Root scripts provide the main coordination layer. The package-specific SPFx build scripts run `shared:build` first so the compiled shared output exists before Heft packages the SPFx solution.

## SPFx tsconfig Changes

The SharePoint Framework generator creates each project as if it were a standalone package with its own full local `node_modules`. In a workspace install, most dependencies are hoisted to the root `node_modules`, so the generated `tsconfig.json` path does not resolve correctly.

Generated standalone shape:

```json
"extends": "./node_modules/@microsoft/spfx-web-build-rig/profiles/default/tsconfig-base.json"
```

Workspace shape:

```json
"extends": "../../node_modules/@microsoft/spfx-web-build-rig/profiles/default/tsconfig-base.json"
```

Each SPFx package also overrides key compiler paths so TypeScript still treats that package as the project root:

```json
"compilerOptions": {
  "outDir": "lib",
  "rootDir": "src",
  "rootDirs": [
    "src",
    "temp/loc-ts",
    "temp/sass-ts",
    "temp/static-asset-ts"
  ],
  "typeRoots": [
    "../../node_modules/@types",
    "../../node_modules/@microsoft"
  ]
},
"include": [
  "src/**/*.ts",
  "src/**/*.tsx"
]
```

The shared package has a separate `tsconfig.json` because it is not an SPFx package. It uses plain `tsc` and sets `"types": []` so hoisted SPFx, Webpack, Node, or test globals do not leak into the shared utility build.

## Commands

Install dependencies from the repository root:

```sh
npm install
```

Build everything:

```sh
npm run build
```

Build individual packages:

```sh
npm run simple-web-part:build
npm run header-application-customizer:build
npm run list-view-command-set:build
npm run shared:build
```

Start an SPFx package:

```sh
npm run simple-web-part:start
npm run header-application-customizer:start
npm run list-view-command-set:start
```

## Notes

- SPFx packages are generated with the official SharePoint Framework Yeoman generator.
- Extension packages use the supported no-framework generator template, then add React manually where needed.
- The shared package uses plain `tsc` because it has no SPFx solution package output.
- See [docs/plans/spfx-monorepo-plan.md](docs/plans/spfx-monorepo-plan.md) for implementation notes and project constraints.

## Resources and References

- https://n8d.at/use-sharepoint-framework-with-npm-yarn-work-spaces
- https://pnp.github.io/blog/post/how-to-manage-multiple-spfx-solutions-efficiently
