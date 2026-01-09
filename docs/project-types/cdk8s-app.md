# CDK8s App Project

The CDK8s App Project type provides an opinionated setup for creating CDK8s applications with Kubernetes manifest generation, combining best practices and common configurations.

## Overview

This project type extends the standard `TypeScriptProject` from projen with additional CDK8s features:

- **CDK8s integration** for Kubernetes manifest generation
- **Multi-version Kubernetes support** (v1.29 to v1.33)
- **Prettier configuration** and **VSCode settings** - see [Default Configurations](../default-configurations.md)
- **Common project structure** and tooling setup
- **Configurable CDK8s options** for custom workflows
- **Application-focused setup** for deploying Kubernetes applications

## Quick Start

To create a new CDK8s App project, use the projen CLI:

```bash linenums="1"
npx projen new --from @jttc/projen-project-types cdk8s-app
```

This command will create a new project with the CDK8s App template and prompt you for the required configuration options such as:

- Project name
- Author information
- Repository URL
- Default branch
- Kubernetes version

After the project is created, you can customize it further by editing the `.projenrc.ts` file:

```typescript linenums="1" title=".projenrc.ts" hl_lines="4 8 12 13 14 15"
import { Cdk8App } from '@jttc/projen-project-types';
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8App({
  name: 'my-awesome-cdk8s-app',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/my-awesome-cdk8s-app.git',
  defaultReleaseBranch: 'main',
  
  // CDK8s specific configuration
  k8sVersion: K8sVersion.V1_31,
  appPath: 'src/k8s',
  appFile: 'main.ts',
  outputPath: 'dist/manifests',
  imports: ['k8s@1.31.0/api/core/v1/configmap', 'k8s@1.31.0/api/apps/v1/deployment'],
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 4**: Choose a descriptive name for your CDK8s application
- **Line 8**: Set the repository URL for your project
- **Line 12**: Set the Kubernetes version for CDK8s imports
- **Line 13**: Configure custom path for Kubernetes source code
- **Line 14**: Set the main application file name
- **Line 15**: Set output directory for generated manifests
- **Line 16**: Add specific Kubernetes resource imports

## Features

### CDK8s Integration

The CDK8s App project includes full CDK8s integration with:

- **Automatic CDK8s setup** with configurable Kubernetes versions
- **Import generation** from Kubernetes APIs and custom resources
- **TypeScript-first** Kubernetes manifest authoring
- **CDK8s tasks** for building and synthesizing manifests
- **Application structure** optimized for Kubernetes deployments

### Kubernetes Version Support

Choose from multiple supported Kubernetes versions:

| Version | CDK8s Plus Package | Description |
|---------|-------------------|-------------|
| v1.29 | `cdk8s-plus-29` | Kubernetes v1.29 support |
| v1.30 | `cdk8s-plus-30` | Kubernetes v1.30 support |
| v1.31 | `cdk8s-plus-31` | Kubernetes v1.31 support (default) |
| v1.32 | `cdk8s-plus-32` | Kubernetes v1.32 support |
| v1.33 | `cdk8s-plus-33` | Kubernetes v1.33 support |

### Common Configurations

This project type includes the same common configurations as other project types:

!!! info "Default Configurations"
    For complete details about Prettier and VSCode configurations, see [Default Configurations](../default-configurations.md). This includes:
    
    - [Prettier Configuration](../default-configurations.md#prettier-configuration) - Code formatting rules and customization
    - [VSCode Configuration](../default-configurations.md#vscode-configuration) - Editor settings and recommended extensions

### CDK8s App Structure

The CDK8s App project creates a complete application structure with:

- **Main application entry point** (`src/main.ts`)
- **CDK8s configuration** (`cdk8s.yaml`)
- **Kubernetes source directory** (configurable, default: `src/k8s`)
- **Output directory** for generated manifests (configurable, default: `kubernetes`)
- **Import generation setup** for Kubernetes APIs
- **Proper TypeScript setup** for CDK8s development

## Configuration Options

### Basic Configuration

All standard `TypeScriptProjectOptions` are supported, along with CDK8s-specific options:

```typescript
interface Cdk8sAppOptions extends Cdk8sBaseOptions, TypeScriptProjectOptions {
  // Standard TypeScript project options
  name: string;
  defaultReleaseBranch: string;
  
  // CDK8s specific options
  k8sVersion?: K8sVersion;
  appPath?: string;
  appFile?: string;
  outputPath?: string;
  imports?: string[];
}
```

### CDK8s Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `k8sVersion` | `K8sVersion` | `V1_31` | Kubernetes version for CDK8s imports |
| `appPath` | `string` | `"src/k8s"` | Path to CDK8s application source |
| `appFile` | `string` | `"main.ts"` | Main application file name |
| `outputPath` | `string` | `"kubernetes"` | Output directory for manifests |
| `imports` | `string[]` | `[]` | Additional Kubernetes imports |

### Advanced Configuration

```typescript title="Advanced .projenrc.ts"
import { Cdk8App } from '@jttc/projen-project-types';
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8App({
  name: 'advanced-cdk8s-app',
  defaultReleaseBranch: 'main',
  
  // CDK8s Configuration
  k8sVersion: K8sVersion.V1_31,
  appPath: 'src/kubernetes',
  appFile: 'app.ts',
  outputPath: 'manifests',
  
  // Kubernetes API imports
  imports: [
    'k8s@1.31.0/api/core/v1/pod',
    'k8s@1.31.0/api/core/v1/service',
    'k8s@1.31.0/api/apps/v1/deployment',
    'k8s@1.31.0/api/networking/v1/ingress',
  ],
  
  // TypeScript project options
  prettier: true,
  vscode: true,
  packageName: '@myorg/k8s-app',
});

project.synth();
```

## Common Usage Patterns

### Simple Web Application

```typescript title="Basic web app deployment"
import { Cdk8App } from '@jttc/projen-project-types';
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8App({
  name: 'my-web-app',
  defaultReleaseBranch: 'main',
  k8sVersion: K8sVersion.V1_31,
  
  imports: [
    'k8s@1.31.0/api/core/v1/service',
    'k8s@1.31.0/api/apps/v1/deployment',
    'k8s@1.31.0/api/networking/v1/ingress',
  ],
});

project.synth();
```

### Microservices Application

```typescript title="Multi-service deployment"
import { Cdk8App } from '@jttc/projen-project-types';
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8App({
  name: 'microservices-platform',
  defaultReleaseBranch: 'main',
  k8sVersion: K8sVersion.V1_31,
  appPath: 'src/platform',
  outputPath: 'dist/k8s',
  
  imports: [
    'k8s@1.31.0/api/core/v1/configmap',
    'k8s@1.31.0/api/core/v1/secret',
    'k8s@1.31.0/api/core/v1/service',
    'k8s@1.31.0/api/apps/v1/deployment',
    'k8s@1.31.0/api/networking/v1/networkpolicy',
  ],
});

project.synth();
```

### Custom Resources Integration

```typescript title="With custom Kubernetes operators"
import { Cdk8App } from '@jttc/projen-project-types';
import { K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8App({
  name: 'custom-resources-app',
  defaultReleaseBranch: 'main',
  k8sVersion: K8sVersion.V1_31,
  
  imports: [
    // Standard Kubernetes resources
    'k8s@1.31.0/api/core/v1',
    'k8s@1.31.0/api/apps/v1',
    // Custom resources from operators
    'prometheus-operator@0.65.1',
    'istio@1.18.0',
  ],
});

project.synth();
```

## Development Workflow

### Generated Files

The CDK8s App project generates several important files:

- **`cdk8s.yaml`**: CDK8s configuration file
- **`src/k8s/main.ts`**: Main CDK8s application (configurable path)
- **`kubernetes/`**: Generated Kubernetes manifests (configurable path)
- **Import files**: Generated TypeScript bindings for Kubernetes APIs

### Available Tasks

| Task | Command | Description |
|------|---------|-------------|
| Build | `npm run build` | Compile TypeScript and generate manifests |
| Import | `npm run cdk8s:import` | Generate TypeScript bindings for Kubernetes APIs |
| Synthesize | `npm run cdk8s:synth` | Generate Kubernetes manifests |
| Test | `npm run test` | Run unit tests |

### Typical Development Flow

1. **Initial setup**: Run `npm run cdk8s:import` to generate API bindings
2. **Write CDK8s code**: Create your Kubernetes application in the configured app path
3. **Build and test**: Run `npm run build` and `npm run test`
4. **Generate manifests**: Run `npm run cdk8s:synth` to create Kubernetes YAML
5. **Deploy**: Apply the generated manifests to your Kubernetes cluster

## CDK8s Component Integration

The CDK8s App project uses the [CDK8s Component](../components/cdk8s.md) internally to provide:

- Kubernetes API import management
- CDK8s task configuration
- Proper dependency management
- Custom resource integration

For more details on the underlying CDK8s functionality, see the [CDK8s Component documentation](../components/cdk8s.md).

## Example Application

Here's a simple example of what your `src/k8s/main.ts` might look like:

```typescript title="src/k8s/main.ts"
import { App, Chart, ChartProps } from 'cdk8s';
import { Construct } from 'constructs';
import { Deployment, Service, IntOrString } from 'cdk8s-plus-31';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Create a deployment
    const deployment = new Deployment(this, 'my-app', {
      replicas: 3,
      containers: [{
        image: 'nginx:latest',
        ports: [{ containerPort: 80 }],
      }],
    });

    // Expose the deployment
    new Service(this, 'my-service', {
      selector: deployment,
      ports: [{ port: 80, targetPort: IntOrString.fromNumber(80) }],
    });
  }
}

const app = new App();
new MyChart(app, 'my-chart');
app.synth();
```

This example creates a simple nginx deployment with a service to expose it.

## Best Practices

### Project Structure

- Keep your CDK8s application code in the configured `appPath` directory
- Use meaningful names for your charts and constructs
- Organize complex applications into multiple chart files
- Leverage TypeScript interfaces for configuration

### Configuration Management

- Use ConfigMaps and Secrets for application configuration
- Implement proper resource naming conventions
- Use labels and annotations for better resource management
- Consider using CDK8s constructs for common patterns

### Testing

- Write unit tests for your CDK8s constructs
- Use snapshot testing for manifest verification
- Test different configuration scenarios
- Validate generated manifests against Kubernetes schemas

### Deployment

- Review generated manifests before deploying
- Use proper namespacing strategies
- Implement resource quotas and limits
- Consider using GitOps workflows for deployment

For more advanced CDK8s usage patterns and examples, refer to the [official CDK8s documentation](https://cdk8s.io/).