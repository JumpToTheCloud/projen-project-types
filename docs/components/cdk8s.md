# CDK8s Component

The CDK8s Component allows you to integrate **CDK for Kubernetes (CDK8s)** into any AWS CDK TypeScript application, enabling you to define Kubernetes manifests using familiar TypeScript constructs alongside your AWS infrastructure.

## Overview

CDK8s is a software development framework for defining Kubernetes applications and reusable abstractions using familiar programming languages. This component seamlessly integrates CDK8s into your existing CDK projects, allowing you to:

- **Define Kubernetes manifests** in TypeScript alongside your AWS resources
- **Share code and constructs** between your AWS and Kubernetes infrastructure
- **Synthesize Kubernetes YAML** from TypeScript code
- **Import existing Kubernetes resources** and CRDs
- **Leverage the power of programming** for Kubernetes configuration

!!! info "Universal Compatibility"
    This component works with **any** AWS CDK TypeScript application, not just those created with our project types. You can add it to existing CDK apps, apps created with standard projen, or any other CDK project setup.

## Key Features

### 🔧 **Automatic Setup**
- Installs required CDK8s dependencies (`cdk8s`, `cdk8s-cli`, `cdk8s-plus-XX`)
- Configures TypeScript compilation for Kubernetes manifests
- Sets up proper project structure for CDK8s development

### ⚙️ **Task Automation**
- **`cdk8s:import`**: Import Kubernetes APIs and CRDs
- **`cdk8s:synth`**: Synthesize Kubernetes manifests from TypeScript
- **`cdk8s`**: Run any CDK8s command with arguments

### 🎯 **Flexible Configuration**
- Support for multiple Kubernetes versions (1.29 to 1.33)
- Custom import paths for external resources
- Configurable output and source directories
- Integration with existing project structure

### 📁 **Project Structure Integration**
- Generates sample application code
- Creates proper `cdk8s.yaml` configuration
- Maintains separation between AWS and Kubernetes code
- Supports both library and application patterns

## Quick Start

### Adding to an Existing CDK App

To add the CDK8s component to any existing AWS CDK TypeScript application:

```typescript linenums="1" title=".projenrc.ts" hl_lines="2 12"
import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
import { Cdk8sComponent } from '@jttc/projen-project-types';

const project = new AwsCdkTypeScriptApp({
  name: 'my-cdk-app',
  cdkVersion: '2.1.0',
  // ... other CDK app options
});

// Add CDK8s component to your existing CDK app
new Cdk8sComponent(project, 'cdk8s');

project.synth();
```

**Highlighted lines explanation:**

- **Line 2**: Import the CDK8s component
- **Line 12**: Add the component to your project with default settings

### Adding to Our CDK App Projects

For projects created with our CDK App project type:

```typescript linenums="1" title=".projenrc.ts" hl_lines="2 11"
import { CdkApp } from '@jttc/projen-project-types';
import { Cdk8sComponent } from '@jttc/projen-project-types';

const project = new CdkApp({
  name: 'my-hybrid-app',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
});

// Add Kubernetes capabilities
new Cdk8sComponent(project, 'cdk8s');

project.synth();
```

**Highlighted lines explanation:**

- **Line 2**: Import both the CDK App project and CDK8s component
- **Line 11**: Add CDK8s functionality to your CDK app

### First Steps After Setup

After adding the component and running `yarn projen`:

```bash linenums="1"
# Install dependencies
yarn install

# Import Kubernetes APIs (automatically runs on first setup)
yarn cdk8s:import

# Build and synthesize Kubernetes manifests
yarn build
yarn cdk8s:synth

# Check generated manifests
ls kubernetes/
```

## Configuration Options

### Basic Configuration

The CDK8s component accepts the following configuration options:

```typescript linenums="1" title="Basic CDK8s Component Configuration"
import { K8sVersion } from '@jttc/projen-project-types';

new Cdk8sComponent(project, 'cdk8s', {
  // Kubernetes version to target
  k8sVersion: K8sVersion.V1_30, // Default

  // Source directory for CDK8s code
  appPath: 'src', // Default

  // Main CDK8s application file
  appFile: 'main.ts', // Default

  // Output directory for synthesized manifests
  outputPath: 'kubernetes', // Default

  // Additional imports (CRDs, operators, etc.)
  imports: [
    'prometheus-operator@1.0.0',
    'istio@3.0.0',
  ],
});
```

### Kubernetes Version Support

Choose from supported Kubernetes versions:

=== "Latest Stable (Recommended)"

    ```typescript linenums="1" title="Use Latest K8s Version" hl_lines="3"
    new Cdk8sComponent(project, 'cdk8s', {
      // Use the latest stable Kubernetes version
      k8sVersion: K8sVersion.V1_33,
    });
    ```

=== "LTS Version"

    ```typescript linenums="1" title="Use LTS K8s Version" hl_lines="3"
    new Cdk8sComponent(project, 'cdk8s', {
      // Use a Long Term Support version
      k8sVersion: K8sVersion.V1_31,
    });
    ```

=== "Specific Version"

    ```typescript linenums="1" title="Pin to Specific Version" hl_lines="3"
    new Cdk8sComponent(project, 'cdk8s', {
      // Pin to specific version for consistency
      k8sVersion: K8sVersion.V1_30,
    });
    ```

### Custom Paths and Structure

Organize your CDK8s code with custom paths:

```typescript linenums="1" title="Custom Project Structure" hl_lines="3 4 5"
new Cdk8sComponent(project, 'cdk8s', {
  // Separate CDK8s code in its own directory
  appPath: 'k8s',
  appFile: 'cluster.ts',
  outputPath: 'manifests',
  
  // Import additional Kubernetes resources
  imports: [
    'cert-manager@1.0.0',
    'nginx-ingress@2.0.0',
  ],
});
```

**Highlighted lines explanation:**

- **Line 3**: Put CDK8s code in `k8s/` directory instead of `src/`
- **Line 4**: Use `cluster.ts` as the main application file
- **Line 5**: Output manifests to `manifests/` directory

## Usage Examples

### Example 1: Basic Kubernetes Application

After adding the component, create a simple Kubernetes application:

```typescript linenums="1" title="src/main.ts (CDK8s Application)" hl_lines="8 9 10 11 12 13"
import { App, Chart, ChartProps } from 'cdk8s';
import { KubeDeployment, KubeService, KubeNamespace } from 'cdk8s-plus-30/lib/imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Create a namespace
    new KubeNamespace(this, 'my-namespace', {
      metadata: { name: 'my-app' }
    });

    // Create a deployment
    new KubeDeployment(this, 'deployment', {
      metadata: {
        namespace: 'my-app',
        name: 'my-app-deployment'
      },
      spec: {
        replicas: 3,
        selector: {
          matchLabels: { app: 'my-app' }
        },
        template: {
          metadata: { labels: { app: 'my-app' } },
          spec: {
            containers: [{
              name: 'app',
              image: 'nginx:latest',
              ports: [{ containerPort: 80 }]
            }]
          }
        }
      }
    });

    // Create a service
    new KubeService(this, 'service', {
      metadata: {
        namespace: 'my-app',
        name: 'my-app-service'
      },
      spec: {
        selector: { app: 'my-app' },
        ports: [{ port: 80, targetPort: 80 }]
      }
    });
  }
}

const app = new App();
new MyChart(app, 'MyChart');
app.synth();
```

**Highlighted lines explanation:**

- **Lines 8-13**: Define Kubernetes resources using imported constructs
- Resources are defined in TypeScript with full IDE support and type safety

### Example 2: AWS + Kubernetes Hybrid Application

Combine AWS resources with Kubernetes manifests:

```typescript linenums="1" title="AWS CDK Stack with Kubernetes" hl_lines="15 16 17 18"
import * as aws from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class HybridStack extends aws.Stack {
  constructor(scope: Construct, id: string, props?: aws.StackProps) {
    super(scope, id, props);

    // Create VPC for EKS cluster
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2
    });

    // Create EKS cluster
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_30,
    });

    // Output cluster details for kubectl configuration
    new aws.CfnOutput(this, 'ClusterName', {
      value: cluster.clusterName,
      description: 'EKS Cluster Name',
    });
  }
}
```

**Highlighted lines explanation:**

- **Lines 15-18**: Create an EKS cluster that can run the Kubernetes manifests generated by CDK8s

Then deploy your CDK8s manifests to the cluster:

```bash linenums="1"
# Deploy AWS infrastructure
npx cdk deploy

# Configure kubectl for the cluster
aws eks update-kubeconfig --name <cluster-name> --region <region>

# Deploy Kubernetes manifests
kubectl apply -f kubernetes/
```

### Example 3: Using External Kubernetes Resources

Import and use external Kubernetes resources like operators:

```typescript linenums="1" title="Using External Resources" hl_lines="4 5 6 7 8"
new Cdk8sComponent(project, 'cdk8s', {
  k8sVersion: K8sVersion.V1_31,
  
  // Import external Kubernetes resources
  imports: [
    'prometheus-operator@0.75.0',
    'cert-manager@1.14.0',
    'istio@1.20.0'
  ],
});
```

**Highlighted lines explanation:**

- **Lines 5-7**: Import specific versions of popular Kubernetes operators and tools

After running `yarn cdk8s:import`, you can use these resources:

```typescript linenums="1" title="Using Imported Operators"
import { Prometheus } from './imports/prometheus-operator';
import { Certificate } from './imports/cert-manager';

// Use imported CRDs in your CDK8s code
new Prometheus(this, 'monitoring', {
  // Prometheus configuration
});

new Certificate(this, 'tls-cert', {
  // Certificate configuration
});
```

## Project Structure

After adding the CDK8s component, your project structure will look like:

```text title="Project Structure with CDK8s"
my-cdk-app/
├── lib/                           # AWS CDK stacks
│   ├── my-stack.ts
│   └── ...
├── src/                           # CDK8s application (configurable)
│   ├── main.ts                    # CDK8s main app
│   └── imports/                   # Auto-generated Kubernetes imports
│       ├── k8s.ts                 # Core Kubernetes API
│       ├── prometheus-operator.ts  # External imports
│       └── ...
├── kubernetes/                    # Generated manifests (configurable)
│   ├── my-chart.k8s.yaml
│   └── ...
├── test/
│   ├── *.test.ts                  # AWS CDK tests
│   └── main.test.ts               # CDK8s tests (for cdk8s projects)
├── cdk8s.yaml                     # CDK8s configuration
├── package.json                   # Updated with CDK8s dependencies
└── ...
```

!!! tip "Separation of Concerns"
    Keep your AWS CDK stacks in `lib/` and your Kubernetes definitions in `src/` (or your configured `appPath`). This maintains clear separation between cloud infrastructure and Kubernetes workloads.

## Available Tasks

The component automatically adds these tasks to your project:

### `yarn cdk8s:import`

Import Kubernetes APIs and external resources:

```bash linenums="1"
# Import default Kubernetes API
yarn cdk8s:import

# Import with additional options
yarn cdk8s:import -- --help
```

### `yarn cdk8s:synth`

Synthesize Kubernetes manifests from TypeScript:

```bash linenums="1"
# Generate manifests
yarn cdk8s:synth

# Output to specific directory
yarn cdk8s:synth -- --output ./my-manifests
```

### `yarn cdk8s`

Run any CDK8s command:

```bash linenums="1"
# General CDK8s help
yarn cdk8s -- --help

# Initialize new chart
yarn cdk8s -- init typescript-app

# List available commands
yarn cdk8s -- list
```

## Best Practices

### 1. **Version Consistency**

Keep Kubernetes versions consistent between your EKS cluster and CDK8s configuration:

```typescript
// In your CDK stack
const cluster = new eks.Cluster(this, 'Cluster', {
  version: eks.KubernetesVersion.V1_30, // Match this version...
});

// In your CDK8s component
new Cdk8sComponent(project, 'cdk8s', {
  k8sVersion: K8sVersion.V1_30, // ...with this version
});
```

### 2. **Namespace Organization**

Use namespaces to organize your Kubernetes resources:

```typescript
// Create environment-specific namespaces
new KubeNamespace(this, 'production', {
  metadata: { name: 'production' }
});

new KubeNamespace(this, 'staging', {
  metadata: { name: 'staging' }
});
```

### 3. **Resource Management**

Define resource requests and limits:

```typescript
containers: [{
  name: 'app',
  image: 'my-app:latest',
  resources: {
    requests: { memory: '128Mi', cpu: '100m' },
    limits: { memory: '256Mi', cpu: '200m' }
  }
}]
```

### 4. **Configuration Management**

Use ConfigMaps and Secrets for application configuration:

```typescript
// Configuration
new KubeConfigMap(this, 'app-config', {
  metadata: { name: 'app-config' },
  data: {
    'database-url': 'postgres://...',
    'api-endpoint': 'https://api.example.com'
  }
});

// Secrets (values should be base64 encoded)
new KubeSecret(this, 'app-secrets', {
  metadata: { name: 'app-secrets' },
  data: {
    'database-password': Buffer.from('secret').toString('base64')
  }
});
```

### 5. **CI/CD Integration**

Integrate CDK8s synthesis into your CI/CD pipeline:

```yaml title=".github/workflows/deploy.yml"
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      # Build and deploy AWS resources
      - run: yarn install
      - run: yarn build
      - run: npx cdk deploy --require-approval never
      
      # Generate and apply Kubernetes manifests
      - run: yarn cdk8s:synth
      - name: Apply manifests
        run: |
          aws eks update-kubeconfig --name $CLUSTER_NAME
          kubectl apply -f kubernetes/
```

## Deployment Workflows

### Local Development

1. **Setup**: Add component and run `yarn projen`
2. **Import**: Run `yarn cdk8s:import` for Kubernetes APIs
3. **Develop**: Write CDK8s code in TypeScript
4. **Synthesize**: Run `yarn cdk8s:synth` to generate manifests
5. **Deploy**: Apply manifests with `kubectl apply -f kubernetes/`

### Production Deployment

1. **AWS Infrastructure**: Deploy CDK stacks first (`npx cdk deploy`)
2. **Cluster Access**: Configure kubectl for your EKS cluster
3. **Manifest Generation**: Run `yarn cdk8s:synth` in CI/CD
4. **Kubernetes Deployment**: Apply manifests automatically or via GitOps

### GitOps Integration

For GitOps workflows with tools like ArgoCD or Flux:

```yaml title="argocd-application.yaml"
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://github.com/myorg/my-app
    path: kubernetes/  # CDK8s output directory
    targetRevision: HEAD
  destination:
    server: https://kubernetes.default.svc
    namespace: default
```

## Troubleshooting

### Import Issues

If `cdk8s:import` fails:

```bash
# Clear import cache
rm -rf src/imports
yarn cdk8s:import

# Check CDK8s version compatibility
yarn list cdk8s cdk8s-cli
```

### Synthesis Errors

For TypeScript compilation errors:

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Verify CDK8s configuration
cat cdk8s.yaml

# Run synthesis with verbose output
yarn cdk8s:synth -- --verbose
```

### Deployment Issues

For kubectl deployment problems:

```bash
# Validate generated manifests
kubectl apply --dry-run=client -f kubernetes/

# Check cluster connectivity
kubectl cluster-info

# Verify namespace existence
kubectl get namespaces
```

### Version Mismatches

For compatibility issues:

```bash
# Check your cluster's Kubernetes version
kubectl version

# Update CDK8s component to match
# Edit .projenrc.ts and set matching k8sVersion
yarn projen
```

## Advanced Configuration

### Custom CDK8s Configuration

Override the generated `cdk8s.yaml`:

```typescript linenums="1" title="Advanced cdk8s.yaml Configuration"
new Cdk8sComponent(project, 'cdk8s', {
  // Component automatically creates cdk8s.yaml
  // Manual overrides can be done post-synth
});

// Add custom post-synth configuration if needed
project.addTask('cdk8s:configure', {
  exec: 'echo "Custom CDK8s configuration"'
});
```

### Multiple Chart Applications

Structure for multiple Kubernetes applications:

```typescript linenums="1" title="Multi-Chart Structure"
new Cdk8sComponent(project, 'cdk8s', {
  appPath: 'k8s',
  appFile: 'apps.ts', // Main file that imports all charts
});
```

```typescript linenums="1" title="k8s/apps.ts"
import { App } from 'cdk8s';
import { WebAppChart } from './charts/web-app';
import { DatabaseChart } from './charts/database';
import { MonitoringChart } from './charts/monitoring';

const app = new App();

new WebAppChart(app, 'web-app');
new DatabaseChart(app, 'database');  
new MonitoringChart(app, 'monitoring');

app.synth();
```

### Environment-Specific Configuration

Use CDK context for environment-specific Kubernetes configuration:

```typescript linenums="1" title="Environment Configuration"
const environment = app.node.tryGetContext('environment') || 'dev';
const config = app.node.tryGetContext(environment);

new KubeDeployment(this, 'app', {
  spec: {
    replicas: config.replicas || 1,
    // Environment-specific configuration
  }
});
```

## Migration Guide

### From Helm Charts

To migrate from Helm charts to CDK8s:

1. **Analyze** existing Helm templates and values
2. **Convert** YAML resources to CDK8s constructs
3. **Replace** Helm values with TypeScript variables
4. **Test** generated manifests match original output

### From Raw YAML

To convert existing Kubernetes YAML:

1. **Import** existing resources: `kubectl get -o yaml > existing.yaml`
2. **Convert** manually or use tools like `cdk8s import`
3. **Refactor** into reusable constructs
4. **Validate** output matches original resources

## Contributing

To contribute improvements to the CDK8s component:

1. **Fork** the repository
2. **Add** tests for new functionality
3. **Update** documentation
4. **Submit** a pull request

## Support

For help with the CDK8s component:

- **Documentation**: Check this guide and [CDK8s docs](https://cdk8s.io/)
- **Issues**: Create a GitHub issue with detailed information
- **Community**: Join CDK8s community discussions
- **Examples**: Check the project's example directory

---

*The CDK8s component is maintained by [Jump to the Cloud](https://jumptothecloud.tech) team and leverages the open-source [CDK8s project](https://cdk8s.io/).*