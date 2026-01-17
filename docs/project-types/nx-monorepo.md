# NX Monorepo Project

The NX Monorepo Project type provides an opinionated setup for creating NX monorepo workspaces with best practices and common configurations pre-configured.

## Overview

This project type extends the standard `TypeScriptProject` from projen with NX-specific features:

- **NX configuration** with sensible defaults and caching
- **Monorepo workspace setup** with package management
- **GitHub Actions workflow** for publishing releases
- **Common project structure** optimized for monorepos
- **Task orchestration** using NX run-many commands
- **Conventional commits** and automated release management

## Quick Start

To create a new NX Monorepo project, use the projen CLI:

```bash linenums="1"
npx projen new --from @jttc/projen-project-types nx-monorepo
```

This command will create a new monorepo workspace with the NX template and prompt you for the required configuration options such as:

- Project name
- Default branch
- Description

After the project is created, you can customize it further by editing the `.projenrc.ts` file:

```typescript linenums="1" title=".projenrc.ts" hl_lines="4 5 8"
import { NxMonorepo } from '@jttc/projen-project-types';

const project = new NxMonorepo({
  name: 'my-awesome-monorepo',
  defaultReleaseBranch: 'main',
  description: 'My awesome NX monorepo',
  
  // Add any additional TypeScript project customizations here
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 4**: Choose a descriptive name for your monorepo
- **Line 5**: Configure the main branch name
- **Line 8**: Add any additional customizations supported by TypeScriptProject

## Features

### NX Configuration

The project automatically configures NX with optimal settings:

```json title="nx.json" linenums="1"
{
  "affected": {
    "defaultBase": "main"
  },
  "namedInput": {
    "default": [
      "{projectRoot}/**/*",
      "!{projectRoot}/**/*.{spec,test}.*",
      "!{projectRoot}/node_modules/**/*"
    ],
    "production": ["default"],
    "testing": ["{projectRoot}/**/*.{spec,test}.*"]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  },
  "release": {
    "projects": ["*"],
    "version": {
      "conventionalCommits": true
    },
    "changelog": {
      "workspaceChangelog": {
        "createRelease": "github"
      }
    }
  }
}
```

### Task Orchestration

The project configures NX-optimized tasks that work across the entire monorepo:

| Task | Description | Command |
|------|-------------|---------|
| `build` | Build all affected projects | `nx run-many --target=build` |
| `test` | Test all affected projects | `nx run-many --target=test` |
| `test:watch` | Watch mode testing | `nx run-many --target=test:watch --skip-nx-cache` |
| `lint` | Lint all affected projects | `nx run-many --target=eslint` |
| `package` | Package all affected projects | `nx run-many --target=package` |
| `graph` | Generate dependency graph | `nx graph` |
| `release` | Full release with conventional commits | Custom release workflow |

### Workspace Structure

The monorepo is configured with a standard workspace structure:

```
my-monorepo/
├── packages/           # Individual projects/libraries
│   ├── project-a/
│   └── project-b/
├── nx.json            # NX configuration
├── package.json       # Workspace package.json
├── .projenrc.ts       # Projen configuration
└── .github/
    └── workflows/
        └── publish.yml # Automated publishing
```

## Configuration Options

### Basic Configuration

All standard `TypeScriptProjectOptions` are supported. Here are the most common options:

```typescript linenums="1" title="Basic NX Monorepo Configuration"
const project = new NxMonorepo({
  // Required options
  name: 'my-nx-monorepo',
  defaultReleaseBranch: 'main',
  
  // Optional TypeScript configurations
  description: 'My awesome NX monorepo',
  authorName: 'Your Name',
  authorEmail: 'your.email@example.com',
  repository: 'https://github.com/username/my-nx-monorepo.git',
  
  // Any other TypeScriptProject options...
});
```

### Common Configuration Options

For Prettier and VSCode configuration options, refer to [Default Configurations](../default-configurations.md):

- **Prettier**: [Customization Guide](../default-configurations.md#customization) 
- **VSCode**: [Configuration Options](../default-configurations.md#customization)

!!! info "Inherited Configurations"
    The NX Monorepo project inherits all common configurations from the base TypeScriptProject. See [Default Configurations](../default-configurations.md) for complete details.

## Package Management

### Workspace Configuration

The project automatically configures the workspace in `package.json`:

```json title="package.json" linenums="1" hl_lines="2 3"
{
  "private": "true",
  "workspaces": ["packages/*"],
  "devDependencies": {
    "nx": "*",
    "@nx/workspace": "*",
    "@nx/devkit": "*"
  }
}
```

**Highlighted lines explanation:**

- **Line 2**: Marks the root as private (not publishable)
- **Line 3**: Configures workspace pattern for packages

### Adding Packages

To add new packages to your monorepo:

1. **Create a new directory** in the `packages/` folder:
   ```bash
   mkdir packages/my-new-package
   ```

2. **Initialize the package** with its own projen configuration:
   ```typescript title="packages/my-new-package/.projenrc.ts"
   import { TypeScriptProject } from 'projen/lib/typescript';
   
   const project = new TypeScriptProject({
     name: 'my-new-package',
     defaultReleaseBranch: 'main',
     parent: '../..', // Reference to monorepo root
   });
   
   project.synth();
   ```

3. **Run projen** to generate the package structure:
   ```bash
   cd packages/my-new-package
   npx projen
   ```

## Release Management

### Automated Publishing

The project includes a GitHub Actions workflow that automatically publishes packages:

```yaml title=".github/workflows/publish.yml" linenums="1"
name: publish
on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to Publish'
        required: false
        default: ''
```

### Release Process

1. **Create releases** using conventional commits:
   ```bash
   yarn release
   ```

2. **Version management** with NX release:
   ```bash
   # Automatic versioning
   yarn nx release version
   
   # Specific version
   yarn nx release version --specifier 1.2.3
   ```

3. **Publish packages**:
   ```bash
   yarn nx release publish
   ```

## Development Workflow

### Daily Development Commands

```bash
# Install all dependencies
yarn install

# Build all affected projects
yarn build

# Test all affected projects  
yarn test

# Lint all affected projects
yarn lint

# Watch mode for testing
yarn test:watch

# View dependency graph
yarn graph

# Run custom nx commands
yarn nx [command]
```

### Working with Affected Changes

NX automatically detects which projects are affected by your changes:

```bash
# Build only affected projects
yarn nx affected:build

# Test only affected projects
yarn nx affected:test

# Lint only affected projects
yarn nx affected:lint
```

## Best Practices

### Project Organization

1. **Keep packages focused** - Each package should have a single responsibility
2. **Use consistent naming** - Follow a clear naming convention for packages
3. **Shared dependencies** - Put common dependencies in the root package.json
4. **Type definitions** - Share types between packages when appropriate

### Development Guidelines

1. **Conventional commits** - Use conventional commit format for automatic changelog generation
2. **Testing strategy** - Ensure each package has comprehensive tests
3. **Documentation** - Document each package's API and usage
4. **Dependencies** - Carefully manage dependencies to avoid conflicts

### Performance Optimization

1. **Leverage NX cache** - Ensure tasks are cacheable where possible
2. **Affected builds** - Use affected commands to build only what changed
3. **Parallel execution** - Configure tasks to run in parallel when possible

## Troubleshooting

### Common Issues

#### Cache Issues
```bash
# Clear NX cache
yarn nx reset
```

#### Dependency Conflicts
```bash
# Clean install
rm -rf node_modules yarn.lock
yarn install
```

#### Build Failures
```bash
# Build with verbose output
yarn nx run-many --target=build --verbose
```

### Getting Help

- **NX Documentation**: [https://nx.dev](https://nx.dev)
- **Projen Documentation**: [https://projen.io](https://projen.io)
- **Project Issues**: Report issues in the project repository

## Examples

### Complete Configuration

```typescript linenums="1" title=".projenrc.ts"
import { NxMonorepo } from '@jttc/projen-project-types';

const project = new NxMonorepo({
  name: 'enterprise-monorepo',
  defaultReleaseBranch: 'main',
  description: 'Enterprise-scale NX monorepo',
  
  // Author information
  authorName: 'Enterprise Team',
  authorEmail: 'team@enterprise.com',
  
  // Repository configuration
  repository: 'https://github.com/enterprise/monorepo.git',
  
  // TypeScript configuration
  tsconfig: {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022'],
    },
  },
  
  // Testing configuration
  jestOptions: {
    coverage: true,
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});

project.synth();
```

This example shows a complete configuration suitable for an enterprise monorepo with high test coverage requirements and modern TypeScript settings.