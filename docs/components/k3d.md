# K3d Component

The K3d Component enables you to set up **local Kubernetes development environments** using K3d (K3s in Docker) in any projen TypeScript project. K3d creates lightweight Kubernetes clusters perfect for development, testing, and learning.

## Overview

K3d is a lightweight wrapper to run K3s (Rancher Lab's minimal Kubernetes distribution) in Docker. This component automatically configures and manages K3d clusters for your development workflow, providing:

- **Local Kubernetes clusters** running in Docker containers
- **Fast cluster creation and destruction** for development iterations
- **Load balancer configuration** for accessing your applications
- **Automated cluster management** through projen tasks
- **Configurable cluster settings** for different development scenarios

!!! info "Universal Compatibility"
    This component works with **any** projen TypeScript project, including CDK apps, libraries, or standalone applications. It's particularly useful when integrated with CDK8s applications for local testing.

## Key Features

### 🚀 **Quick Setup**
- Generates `k3d.yaml` configuration file automatically
- Creates projen tasks for cluster lifecycle management
- Configures load balancer for application access
- Sets up development-optimized defaults

### ⚙️ **Cluster Management Tasks**
- **`k3d:create`**: Create and start the K3d cluster
- **`k3d:start`**: Start an existing stopped cluster
- **`k3d:stop`**: Stop a running cluster (preserves data)
- **`k3d:delete`**: Completely remove the cluster

### 🎯 **Development Optimized**
- Disables Traefik by default (reduces resource usage)
- Disables metrics-server by default (faster startup)
- Configures load balancer on port 8080 by default
- Updates local kubeconfig automatically

### 📁 **Flexible Configuration**
- Custom cluster names and network settings
- Configurable server and agent node counts
- Custom K3s arguments and options
- Load balancer port configuration

## Quick Start

### Adding to a CDK8s App

K3d is automatically included in CDK8s applications for local development:

```typescript linenums="1" title=".projenrc.ts"
import { Cdk8App } from '@jttc/projen-project-types';

const project = new Cdk8App({
  name: 'my-k8s-app',
  defaultReleaseBranch: 'main',
  // K3d is enabled by default
});

project.synth();
```

### Adding to Any TypeScript Project

```typescript linenums="1" title=".projenrc.ts" hl_lines="2 11-15"
import { TypeScriptProject } from 'projen/lib/typescript';
import { K3d } from '@jttc/projen-project-types';

const project = new TypeScriptProject({
  name: 'my-project',
  defaultReleaseBranch: 'main',
});

// Add K3d component
new K3d(project, 'k3d', {
  k3d: {
    metadata: { name: 'my-dev-cluster' }
  }
});

project.synth();
```

## Configuration Options

The K3d component accepts a `K3dOptions` configuration object with the following structure:

### Basic Configuration

```typescript
const k3dOptions = {
  k3d: {
    metadata: { name: 'my-cluster' },
    servers: 1,        // Number of server nodes
    agents: 0,         // Number of worker nodes  
    network: 'k3s',    // Docker network name
    ports: [{          // Port mappings
      port: '8080:80',
      nodeFilters: ['loadbalancer']
    }],
    options: {
      k3s: {
        extraArgs: [   // Custom K3s arguments
          {
            arg: '--disable=servicelb',
            nodeFilters: ['server:*']
          }
        ]
      },
      kubeconfig: {
        updateDefaultKubeconfig: true
      }
    }
  }
};
```

### Advanced Configuration

```typescript
const advancedK3dOptions = {
  k3d: {
    metadata: { name: 'production-like-cluster' },
    servers: 3,        // HA control plane
    agents: 2,         // Worker nodes
    network: 'custom-net',
    image: 'docker.io/rancher/k3s:v1.30.8-k3s1',
    ports: [
      {
        port: '8080:80',
        nodeFilters: ['loadbalancer']
      },
      {
        port: '8443:443', 
        nodeFilters: ['loadbalancer']
      }
    ],
    options: {
      k3s: {
        extraArgs: [
          {
            arg: '--disable=traefik',
            nodeFilters: ['server:*']
          },
          {
            arg: '--disable=servicelb',
            nodeFilters: ['server:*']
          }
        ]
      },
      kubeconfig: {
        updateDefaultKubeconfig: true
      }
    }
  }
};
```

## Generated Files

### k3d.yaml

The component generates a `k3d.yaml` configuration file in your project root:

```yaml title="k3d.yaml"
apiVersion: k3d.io/v1alpha5
kind: Simple
metadata:
  name: my-cluster
servers: 1
agents: 0
network: k3s
image: docker.io/rancher/k3s:v1.30.8-k3s1
ports:
  - port: 8080:80
    nodeFilters:
      - loadbalancer
options:
  k3s:
    extraArgs:
      - arg: --disable=traefik
        nodeFilters:
          - server:*
      - arg: --disable=metrics-server
        nodeFilters:
          - server:*
  kubeconfig:
    updateDefaultKubeconfig: true
```

## Development Workflow

### 1. Create Development Cluster

```bash
# Create and start the cluster
yarn k3d:create

# Verify cluster is running
kubectl cluster-info
kubectl get nodes
```

### 2. Deploy Your Applications

```bash
# If using CDK8s
yarn cdk8s:synth
kubectl apply -f dist/

# Or apply any Kubernetes manifests
kubectl apply -f manifests/
```

### 3. Access Applications

With the default configuration, applications are accessible at:
- HTTP: `http://localhost:8080`
- HTTPS: `https://localhost:8443` (if configured)

### 4. Manage Cluster Lifecycle

```bash
# Stop cluster (preserves data)
yarn k3d:stop

# Start stopped cluster  
yarn k3d:start

# Delete cluster completely
yarn k3d:delete
```

## Projen Tasks

The component creates the following projen tasks:

| Task | Description | Command |
|------|-------------|---------|
| `k3d:create` | Create and start K3d cluster | `k3d cluster create --config k3d.yaml` |
| `k3d:start` | Start existing cluster | `k3d cluster start <cluster-name>` |
| `k3d:stop` | Stop running cluster | `k3d cluster stop <cluster-name>` |  
| `k3d:delete` | Delete cluster | `k3d cluster delete <cluster-name>` |

## Integration Examples

### With CDK8s Application

K3d works seamlessly with CDK8s applications for local development:

```typescript title="src/main.ts"
import { App, Chart } from 'cdk8s';
import { KubeDeployment, KubeService } from 'cdk8s-plus-30/lib/imports/k8s';

const app = new App();
const chart = new Chart(app, 'MyChart');

// Define your Kubernetes resources
new KubeDeployment(chart, 'nginx', {
  spec: {
    replicas: 3,
    selector: { matchLabels: { app: 'nginx' } },
    template: {
      metadata: { labels: { app: 'nginx' } },
      spec: {
        containers: [{
          name: 'nginx',
          image: 'nginx:latest',
          ports: [{ containerPort: 80 }]
        }]
      }
    }
  }
});

new KubeService(chart, 'nginx-service', {
  spec: {
    selector: { app: 'nginx' },
    ports: [{ port: 80, targetPort: 80 }],
    type: 'LoadBalancer'
  }
});

app.synth();
```

Development workflow:
```bash
# 1. Create cluster
yarn k3d:create

# 2. Synthesize and deploy
yarn cdk8s:synth
kubectl apply -f dist/

# 3. Access application
curl http://localhost:8080
```

### Custom Network Configuration

For projects requiring custom networking:

```typescript
new K3d(project, 'k3d', {
  k3d: {
    metadata: { name: 'custom-cluster' },
    network: 'my-custom-network',
    ports: [
      { port: '3000:80', nodeFilters: ['loadbalancer'] },
      { port: '3001:8080', nodeFilters: ['loadbalancer'] }
    ]
  }
});
```

## Prerequisites

Before using the K3d component, ensure you have:

1. **Docker Desktop** or **Docker Engine** running
2. **K3d installed** on your system
3. **kubectl** for cluster interaction

### Installation Instructions

=== "macOS (Homebrew)"
    ```bash
    # Install K3d
    brew install k3d
    
    # Install kubectl if not already installed
    brew install kubectl
    ```

=== "Linux"
    ```bash
    # Install K3d
    curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash
    
    # Install kubectl
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    ```

=== "Windows (Chocolatey)"
    ```powershell
    # Install K3d
    choco install k3d
    
    # Install kubectl
    choco install kubernetes-cli
    ```

## Common Use Cases

### 1. Microservices Development

Test multiple services in a local Kubernetes environment:

```typescript
new K3d(project, 'k3d', {
  k3d: {
    metadata: { name: 'microservices-dev' },
    servers: 1,
    agents: 2,  // More resources for multiple services
    ports: [
      { port: '8080:80', nodeFilters: ['loadbalancer'] },
      { port: '8443:443', nodeFilters: ['loadbalancer'] },
      { port: '5432:5432', nodeFilters: ['loadbalancer'] } // Database
    ]
  }
});
```

### 2. CI/CD Testing

Lightweight clusters for automated testing:

```typescript
new K3d(project, 'k3d', {
  k3d: {
    metadata: { name: 'ci-test-cluster' },
    servers: 1,
    agents: 0,  // Minimal resource usage
    options: {
      k3s: {
        extraArgs: [
          { arg: '--disable=traefik', nodeFilters: ['server:*'] },
          { arg: '--disable=servicelb', nodeFilters: ['server:*'] },
          { arg: '--disable=metrics-server', nodeFilters: ['server:*'] }
        ]
      }
    }
  }
});
```

### 3. Production Simulation

Multi-node setup for testing HA configurations:

```typescript
new K3d(project, 'k3d', {
  k3d: {
    metadata: { name: 'prod-simulation' },
    servers: 3,  // HA control plane
    agents: 3,   // Multiple workers
    network: 'production-net'
  }
});
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 8080
   lsof -i :8080
   
   # Use different port in configuration
   ports: [{ port: '9090:80', nodeFilters: ['loadbalancer'] }]
   ```

2. **Cluster Won't Start**
   ```bash
   # Check Docker is running
   docker ps
   
   # View K3d logs
   k3d cluster list
   docker logs k3d-<cluster-name>-server-0
   ```

3. **Kubectl Context Issues**
   ```bash
   # List available contexts
   kubectl config get-contexts
   
   # Switch to K3d context
   kubectl config use-context k3d-<cluster-name>
   ```

## Resources

- [K3d Official Documentation](https://k3d.io/)
- [K3d GitHub Repository](https://github.com/k3d-io/k3d)
- [K3s Documentation](https://docs.k3s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [CDK8s Documentation](https://cdk8s.io/)

## Related Components

- **[CDK8s Component](cdk8s.md)**: Perfect companion for defining Kubernetes manifests in TypeScript
- **[Commitzent Component](commitzent.md)**: Conventional commits for your Kubernetes projects