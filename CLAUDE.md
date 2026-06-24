# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@jttc/projen-project-types` is a **jsii library** that publishes opinionated [projen](https://projen.io) project types and components for use in other repos. Consumers run `npx projen new --from @jttc/projen-project-types <pjid>` to scaffold a new project. This repo is itself bootstrapped with `JsiiProject` (defined here in `src/cdk/jsii-project.ts`) — it uses its own output.

## Commands

```bash
# Regenerate all projen-managed config files from .projenrc.ts
npx projen

# Full build: synth → compile (jsii) → post-compile (docgen + copy templates) → test → package
npx projen build

# Compile only (jsii)
npx projen compile

# Run tests + eslint
npx projen test

# Run a single test file
npx jest test/cdk-library.test.ts

# Watch mode
npx projen test:watch

# Lint only
npx projen eslint

# Serve docs locally at http://localhost:8099
npx projen docs:serve

# Interactive conventional commit prompt
npx projen commit
```

> **Never edit generated files directly.** Files managed by projen are read-only. Edit `.projenrc.ts` then run `npx projen`.

## Architecture

### The `CommonOptionsConfig` pattern

Every project class (`CdkLibrary`, `CdkApp`, `Cdk8sLibrary`, `JsiiProject`, `NxMonorepo`, etc.) follows the same two-step constructor pattern:

```typescript
const opts = CommonOptionsConfig.withCommonOptionsDefaults({ ...options }); // applies prettier/eslint defaults
super(opts);
const components = CommonOptionsConfig.withCommonComponents(this, opts);    // wires VSCode, Commitzent, Agents
this.commitzent = components.commitzent;
```

`CommonOptionsConfig` lives in `src/common/common-options.ts`. It:
- Defaults `prettier: true` and `eslint: true` for root projects, `false` for subprojects
- Injects the opinionated prettier config (single quotes, trailing commas, brackets)
- Creates (or reuses) a `VsCode` component on the root/parent project
- Adds the `Commitzent` and `Agents` components (both opt-out via `commitzent: false` / `agents: false`)

### Project types (`src/cdk/`, `src/monorepo/`, `src/terraform/`)

| Class | Extends | `@pjid` |
|---|---|---|
| `CdkLibrary` | `AwsCdkConstructLibrary` | `cdk-library` |
| `CdkApp` | `AwsCdkTypeScriptApp` | `cdk-app` |
| `Cdk8sLibrary` | `AwsCdkConstructLibrary` + adds `Cdk8sComponent` | `cdk8s-library` |
| `Cdk8sApp` | `AwsCdkTypeScriptApp` + adds `Cdk8sComponent` | `cdk8s-app` |
| `JsiiProject` | `JsiiProject` (projen) | `jsii-project` |
| `NxMonorepo` | `TypeScriptProject` | `nx-monorepo` |
| `TerraformStackProject` | `TerraformBaseProject` → `Project` | `terraform-stack` |
| `TerraformModuleProject` | `TerraformBaseProject` → `Project` | `terraform-module` |

The `@pjid` JSDoc tag is what projen uses to resolve `npx projen new --from … <pjid>`.

### Terraform provider strategy pattern

`TerraformBaseProject` generates `versions.tf` and optionally `provider.tf`. Providers are plain strategy classes (not projen `Component`s) that extend `TerraformProvider` (`src/terraform/providers/provider-strategy.ts`) and implement `providerSource()` and `generateProviderBlock()`. Only `HetznerProvider` exists today — add new providers by extending that base class.

### Components (`src/components/`)

- **`Commitzent`** — adds `commitizen` + `cz-customizable` deps, generates `.czrc` and `.cz-config.js`, exposes `addScope()` for extending commit scopes after construction
- **`Agents`** — generates `AGENTS.md` with project-type-specific content (detected by constructor name at runtime)
- **`Cdk8sComponent`** — adds cdk8s deps, generates `cdk8s.yaml`, adds `cdk8s:import` / `cdk8s:synth` tasks; if hosted inside an `NxMonorepo`, also wires `nx run-many` commands on the parent
- **`K3d`** / **`K3dBase`** — local Kubernetes cluster tooling

### Testing approach

Tests use `projen/lib/testing`'s `Testing.synth(project)` to get a snapshot of all generated files without writing to disk. Assertions check both existence of files and snapshot equality. Update snapshots with `npx jest --updateSnapshot`.

### Post-compile template copy

`src/components/cdk8s/` contains `.ts.template` files (sample code for generated projects). The post-compile task copies them to `lib/components/cdk8s/` so they're bundled in the npm package:

```
cp src/components/cdk8s/*.template lib/components/cdk8s/ || true
```

### Release

Releases are **manual** (`workflow_dispatch`), only on `feat`/`fix` commits, always as `1.x.x-beta.N`. Documentation is deployed automatically after a release via the `deploy-docs` workflow using `mike` for versioned MkDocs.
