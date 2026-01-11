# Projen Project Types

Welcome to **Projen Project Types** - a collection of opinionated custom project templates for [projen.io](https://projen.io).

## Overview

This repository provides a curated set of project types that extend projen's capabilities with opinionated configurations and best practices. These project types are designed to accelerate development workflows while maintaining consistency and quality across projects.

## What is Projen?

[Projen](https://projen.io) is a powerful tool for defining and maintaining complex project configurations through code. Instead of manually managing configuration files, projen allows you to define your project structure, dependencies, build processes, and tooling configurations in a single TypeScript file.

## Why Opinionated Project Types?

While projen provides excellent base project types, real-world projects often require specific configurations, tooling setups, and workflow patterns. This repository bridges that gap by providing:

- **Pre-configured project templates** with best practices baked in
- **Consistent tooling** across different project types
- **Automated setup** for common development workflows
- **Extensible configurations** that can be customized for specific needs

## Features

- 🚀 **Ready-to-use project templates** for various use cases
- 📦 **Integrated tooling** with sensible defaults
- 🔧 **Customizable configurations** to fit your needs
- 📚 **Comprehensive documentation** and examples
- 🔄 **Continuous integration** templates included

## Getting Started

Choose from our available project types and components:

### 📦 Project Types

| Project Type | Description | Use Case | Quick Start |
|--------------|-------------|----------|-------------|
| **[CDK Library](project-types/cdk-library.md)** | AWS CDK construct libraries | Creating reusable CDK constructs | `npx projen new --from @jttc/projen-project-types cdk-library` |
| **[CDK App](project-types/cdk-app.md)** | AWS CDK applications | Building deployable AWS infrastructure | `npx projen new --from @jttc/projen-project-types cdk-app` |
| **[CDK8s Library](project-types/cdk8s-library.md)** | CDK8s construct libraries with Kubernetes support | Creating reusable Kubernetes constructs | `npx projen new --from @jttc/projen-project-types cdk8s-library` |
| **[CDK8s App](project-types/cdk8s-app.md)** | CDK8s applications with Kubernetes support | Building deployable Kubernetes applications | `npx projen new --from @jttc/projen-project-types cdk8s-app` |

### 🧩 Components

| Component | Description | Integration | Documentation |
|-----------|-------------|-------------|---------------|
| **[CDK8s Component](components/cdk8s.md)** | Kubernetes manifest generation with CDK8s | Can be added to any project type | [View Details](components/cdk8s.md) |
| **[K3d Component](components/k3d.md)** | Local Kubernetes development with K3d | Included in CDK8s apps, can be added to any project | [View Details](components/k3d.md) |
| **[Commitzent Component](components/commitzent.md)** | Conventional Commits with interactive prompts | Included by default in all project types | [View Details](components/commitzent.md) |

### ⚙️ Common Features

All project types include:

- **[Prettier Configuration](default-configurations.md#prettier-configuration)** - Consistent code formatting
- **[VSCode Integration](default-configurations.md#vscode-configuration)** - Optimized editor experience
- **[Commitzent Component](components/commitzent.md)** - Conventional commits with interactive prompts
- **TypeScript Setup** - Best practices and configurations
- **Testing Framework** - Jest with appropriate configurations
- **CI/CD Ready** - GitHub Actions workflows included

!!! tip "Getting Started"
    After running any project creation command, follow the interactive prompts to configure your project, then customize further by editing `.projenrc.ts`

## Quick Examples

### CDK Library Example
```typescript title=".projenrc.ts"
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'my-awesome-constructs',
  author: 'Your Name',
  authorAddress: 'your@email.com',
  repositoryUrl: 'https://github.com/yourusername/my-awesome-constructs.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
});

project.synth();
```

### CDK8s Library Example
```typescript title=".projenrc.ts"  
import { Cdk8sLibrary, K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  name: 'my-k8s-constructs',
  author: 'Your Name',
  authorAddress: 'your@email.com',
  repositoryUrl: 'https://github.com/yourusername/my-k8s-constructs.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  k8sVersion: K8sVersion.V1_31,
});

project.synth();
```

## Architecture

This project follows a modular architecture:

- **Project Types**: Complete project templates with full configuration
- **Components**: Reusable functionality that can be added to any project
- **Common Configurations**: Shared settings applied across all project types

## Roadmap

Future project types and components planned:

- **Next.js Projects** - Full-stack TypeScript applications
- **Node.js APIs** - REST and GraphQL API templates  
- **React Libraries** - Component library templates
- **Terraform Modules** - Infrastructure as Code templates
- **Docker Components** - Containerization support

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to help improve these project types.

## License

This project is licensed under the terms specified in the LICENSE file.
