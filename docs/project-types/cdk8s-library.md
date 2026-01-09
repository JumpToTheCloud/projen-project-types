# CDK8s Library Project

The CDK8s Library Project type provides an opinionated setup for creating AWS CDK construct libraries with CDK8s integration for Kubernetes deployment, combining best practices and common configurations.

## Overview

This project type extends the standard `AwsCdkConstructLibrary` from projen with additional CDK8s features:

- **CDK8s integration** for Kubernetes manifest generation
- **Multi-version Kubernetes support** (v1.29 to v1.33)
- **Prettier configuration** and **VSCode settings** - see [Default Configurations](../default-configurations.md)
- **Common project structure** and tooling setup
- **Configurable CDK8s options** for custom workflows

## Quick Start

To create a new CDK8s Library project, use the projen CLI:

```bash linenums="1"
npx projen new --from @jttc/projen-project-types cdk8s-library
```

This command will create a new project with the CDK8s Library template and prompt you for the required configuration options such as:

- Project name
- Author information
- Repository URL
- CDK version
- Kubernetes version
- Default branch

After the project is created, you can customize it further by editing the `.projenrc.ts` file:

```typescript linenums="1" title=".projenrc.ts" hl_lines="4 8 12 13 14 15"
import { Cdk8sLibrary } from '@jttc/projen-project-types';
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  name: 'my-awesome-cdk8s-library',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/my-awesome-cdk8s-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // CDK8s specific configuration
  k8sVersion: K8sVersion.V1_31,
  appPath: 'src/k8s',
  outputPath: 'manifests',
  imports: ['custom-k8s-constructs@1.0.0'],
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 4**: Choose a descriptive name for your CDK8s construct library
- **Line 8**: Pin to a specific CDK version for consistency
- **Line 13**: Set the Kubernetes version for CDK8s imports
- **Line 14**: Configure custom path for Kubernetes source code
- **Line 15**: Set output directory for generated manifests
- **Line 16**: Add custom Kubernetes imports

## Features

### CDK8s Integration

The CDK8s Library project includes full CDK8s integration with:

- **Automatic CDK8s setup** with configurable Kubernetes versions
- **Import generation** from Kubernetes APIs and custom resources
- **TypeScript-first** Kubernetes manifest authoring
- **CDK8s tasks** for building and synthesizing manifests

### Kubernetes Version Support

Choose from multiple supported Kubernetes versions:

| Version | CDK8s Plus Package | Description |
|---------|-------------------|-------------|
| v1.29 | `cdk8s-plus-29` | Kubernetes 1.29 API support |
| v1.30 | `cdk8s-plus-30` | Kubernetes 1.30 API support (default) |
| v1.31 | `cdk8s-plus-31` | Kubernetes 1.31 API support |
| v1.32 | `cdk8s-plus-32` | Kubernetes 1.32 API support |
| v1.33 | `cdk8s-plus-33` | Kubernetes 1.33 API support |

### Common Configurations

This project type includes the same common configurations as other project types:

!!! info "Default Configurations"
    For complete details about Prettier and VSCode configurations, see [Default Configurations](../default-configurations.md). This includes:
    
    - [Prettier Configuration](../default-configurations.md#prettier-configuration) - Code formatting rules and customization
    - [VSCode Configuration](../default-configurations.md#vscode-configuration) - Editor settings and recommended extensions

## Configuration Options

### Basic Configuration

All standard `AwsCdkConstructLibraryOptions` are supported, plus CDK8s-specific options:

```typescript linenums="1" title="Basic CDK8s Library Configuration"
const project = new Cdk8sLibrary({
  // Required CDK options
  name: 'my-cdk8s-library',
  author: 'Your Name',
  authorAddress: 'your.email@example.com', 
  repositoryUrl: 'https://github.com/yourusername/my-cdk8s-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // Optional CDK8s configurations (see sections below)
});
```

### CDK8s-Specific Options

#### Kubernetes Version

```typescript linenums="1" title="Kubernetes Version Configuration" hl_lines="3"
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  // ... other options
  k8sVersion: K8sVersion.V1_31, // Default: V1_30
});
```

#### Custom Paths

Configure where CDK8s files are located:

```typescript linenums="1" title="Custom Path Configuration" hl_lines="3 4 5"
const project = new Cdk8sLibrary({
  // ... other options
  appPath: 'src/k8s',        // Default: 'src'
  appFile: 'app.ts',         // Default: 'main.ts'
  outputPath: 'manifests',   // Default: 'kubernetes'
});
```

#### Custom Imports

Add additional Kubernetes resource imports:

```typescript linenums="1" title="Custom Imports Configuration" hl_lines="3 4 5 6"
const project = new Cdk8sLibrary({
  // ... other options
  imports: [
    'cert-manager@v1.8.0',
    'prometheus-operator@v0.60.0',
    'custom-crds@latest',
  ],
});
```

### Common Configuration Options

For Prettier and VSCode configuration options, refer to [Default Configurations](../default-configurations.md):

- **Prettier**: [Customization Guide](../default-configurations.md#customization)
- **VSCode**: [Configuration Options](../default-configurations.md#customization)

## Examples

### Basic CDK8s Library

Simple setup with default configurations:

```typescript linenums="1" title=".projenrc.ts - Basic Setup"
import { Cdk8sLibrary } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  name: 'basic-cdk8s-library',
  author: 'Jane Smith',
  authorAddress: 'jane@company.com',
  repositoryUrl: 'https://github.com/company/basic-cdk8s-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
});

project.synth();
```

### Advanced CDK8s Library

Customized setup with specific Kubernetes version and custom paths:

```typescript linenums="1" title=".projenrc.ts - Advanced Setup" hl_lines="10 11 12 13 14 15 16 17 18 19"
import { Cdk8sLibrary, K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  name: 'advanced-cdk8s-library',
  author: 'John Developer',
  authorAddress: 'john@company.com',
  repositoryUrl: 'https://github.com/company/advanced-cdk8s-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // CDK8s customization
  k8sVersion: K8sVersion.V1_31,
  appPath: 'src/kubernetes',
  appFile: 'main.ts',
  outputPath: 'dist/manifests',
  imports: [
    'cert-manager@v1.13.0',
    'prometheus-operator@v0.70.0',
  ],
  
  // Standard configurations (see Default Configurations for options)
  prettier: true,
  vscode: true,
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 12**: Use Kubernetes v1.31 APIs
- **Line 13**: Place CDK8s source files in `src/kubernetes/`
- **Line 14**: Main entry file for CDK8s application
- **Line 15**: Output generated manifests to `dist/manifests/`
- **Lines 16-19**: Import cert-manager and Prometheus operator CRDs

### Enterprise Setup

Example with minimal prettier configuration and disabled VSCode:

```typescript linenums="1" title=".projenrc.ts - Enterprise Setup" hl_lines="11 15 16 17 18 19 20 21"
import { Cdk8sLibrary, K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  name: 'enterprise-cdk8s-library',
  author: 'Enterprise Team',
  authorAddress: 'team@enterprise.com',
  repositoryUrl: 'https://github.com/enterprise/cdk8s-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  k8sVersion: K8sVersion.V1_32,
  
  // Custom configurations (see Default Configurations for more options)
  vscode: false,
  prettierOptions: {
    settings: {
      printWidth: 120,
      tabWidth: 4,
      singleQuote: false,
    },
  },
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 11**: Use latest supported Kubernetes version
- **Line 15**: Disable VSCode configuration for enterprise environment
- **Lines 16-21**: Custom prettier settings with longer lines and double quotes

## Project Structure

After running `projen synth`, your CDK8s library project will have the following structure:

```
my-cdk8s-library/
├── src/
│   ├── main.ts              # Main CDK8s application entry point
│   └── index.ts             # Library exports
├── test/                    # Test files
├── kubernetes/              # Generated Kubernetes manifests (after synth)
├── cdk8s.yaml              # CDK8s configuration
├── package.json            # Dependencies including CDK8s packages
├── .prettierrc.json        # Code formatting configuration
├── .vscode/                # VSCode workspace settings
│   ├── settings.json
│   └── extensions.json
└── .projenrc.ts           # Projen configuration
```

### Generated CDK8s Files

- **`src/main.ts`**: Sample CDK8s application with basic Kubernetes resources
- **`cdk8s.yaml`**: CDK8s configuration specifying app entry point and output location
- **`kubernetes/`**: Directory where synthesized YAML manifests are generated

### CDK8s Tasks

The project includes these npm scripts for CDK8s workflows:

| Script | Command | Description |
|--------|---------|-------------|
| `cdk8s` | `cdk8s synth` | Generate Kubernetes manifests |
| `cdk8s:import` | `cdk8s import` | Import Kubernetes APIs and CRDs |
| `cdk8s:synth` | `cdk8s synth` | Alias for `cdk8s` command |

## Best Practices

### Development Workflow

1. **Define your constructs** in TypeScript using CDK8s APIs
2. **Import CRDs** for custom resources: `npm run cdk8s:import`
3. **Generate manifests** regularly: `npm run cdk8s`
4. **Test generated YAML** with your Kubernetes cluster
5. **Version your library** using standard npm/projen publishing

### Resource Organization

```typescript linenums="1" title="src/main.ts - Recommended Structure"
import { App, Chart } from 'cdk8s';
import { Deployment, Service } from 'cdk8s-plus-31';

export class MyConstruct extends Chart {
  constructor(scope: App, id: string) {
    super(scope, id);

    // Define your Kubernetes resources here
    const deployment = new Deployment(this, 'app-deployment', {
      // ... configuration
    });

    const service = new Service(this, 'app-service', {
      // ... configuration
    });
  }
}

// For library usage
const app = new App();
new MyConstruct(app, 'my-construct');
app.synth();
```

### Testing Strategy

- **Unit test** your CDK8s constructs with Jest
- **Snapshot test** generated manifests
- **Integration test** with real Kubernetes clusters
- **Validate** YAML output with kubeval or similar tools

## Troubleshooting

### Common Issues

#### Import Errors

If you encounter CDK8s import errors:

```bash
# Reimport Kubernetes APIs
npm run cdk8s:import

# Check your cdk8s.yaml configuration
cat cdk8s.yaml
```

#### Version Mismatches

Ensure your Kubernetes version matches your cluster:

```typescript
// Update in .projenrc.ts
k8sVersion: K8sVersion.V1_31, // Match your cluster version
```

#### Path Issues

Verify your CDK8s paths are correctly configured:

```yaml title="cdk8s.yaml"
language: typescript
app: npx ts-node src/main.ts
output: kubernetes
```

### Getting Help

- **CDK8s Documentation**: [https://cdk8s.io/](https://cdk8s.io/)
- **Project Issues**: [GitHub Issues](https://github.com/JumpToTheCloud/projen-project-types/issues)
- **AWS CDK**: [https://docs.aws.amazon.com/cdk/](https://docs.aws.amazon.com/cdk/)

## Migration Guide

### From Standard CDK Library

To migrate from a standard CDK library to CDK8s library:

1. **Update your `.projenrc.ts`**:
   ```typescript
   // Before
   import { CdkLibrary } from '@jttc/projen-project-types';
   
   // After  
   import { Cdk8sLibrary } from '@jttc/projen-project-types';
   ```

2. **Add CDK8s configuration**:
   ```typescript
   const project = new Cdk8sLibrary({
     // ... existing options
     k8sVersion: K8sVersion.V1_31,
   });
   ```

3. **Run projen to regenerate**:
   ```bash
   npx projen
   ```

### From Plain CDK8s

To adopt this project type from a plain CDK8s project:

1. **Install the package**:
   ```bash
   npm install --save-dev @jttc/projen-project-types
   ```

2. **Create `.projenrc.ts`** with your current configuration
3. **Run projen** to apply the project template
4. **Review and commit** the generated configuration files

## Contributing

Contributions to improve the CDK8s Library project type are welcome! Please check the repository for details on:

- Reporting bugs
- Suggesting enhancements
- Submitting pull requests
- Development workflow

## Support

For support with the CDK8s Library project type:

- **Repository**: [GitHub Repository](https://github.com/JumpToTheCloud/projen-project-types)
- **Issues**: [GitHub Issues](https://github.com/JumpToTheCloud/projen-project-types/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JumpToTheCloud/projen-project-types/discussions)