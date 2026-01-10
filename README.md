# 🏗️ Projen Project Types

> **Opinionated project templates for [projen.io](https://projen.io) that accelerate development with best practices built-in**

[![npm version](https://img.shields.io/npm/v/@jttc/projen-project-types)](https://www.npmjs.com/package/@jttc/projen-project-types)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Documentation](https://img.shields.io/badge/docs-mkdocs-blue)](https://jumptothecloud.github.io/projen-project-types/)
[![GitHub](https://img.shields.io/github/stars/JumpToTheCloud/projen-project-types?style=social)](https://github.com/JumpToTheCloud/projen-project-types)

## ✨ What is this?

This package provides **ready-to-use project templates** that extend [projen](https://projen.io) with opinionated configurations, saving you hours of setup time while ensuring consistency and best practices across your projects.

Instead of manually configuring Prettier, ESLint, VSCode settings, CI/CD pipelines, and other tools for every project, these templates give you everything pre-configured and battle-tested.

## 🚀 Quick Start

```bash
# Create a CDK construct library
npx projen new --from @jttc/projen-project-types cdk-library

# Create a CDK application  
npx projen new --from @jttc/projen-project-types cdk-app

# Create a CDK8s construct library with Kubernetes support
npx projen new --from @jttc/projen-project-types cdk8s-library

# Create a CDK8s application with Kubernetes support
npx projen new --from @jttc/projen-project-types cdk8s-app
```

## 📦 Available Project Types

| Project Type | Description | Best For |
|--------------|-------------|----------|
| **[CDK Library](https://jumptothecloud.github.io/projen-project-types/project-types/cdk-library/)** | AWS CDK construct libraries | Creating reusable AWS infrastructure components |
| **[CDK App](https://jumptothecloud.github.io/projen-project-types/project-types/cdk-app/)** | AWS CDK applications | Building and deploying AWS infrastructure |
| **[CDK8s Library](https://jumptothecloud.github.io/projen-project-types/project-types/cdk8s-library/)** | CDK8s libraries with Kubernetes | Creating reusable Kubernetes constructs |
| **[CDK8s App](https://jumptothecloud.github.io/projen-project-types/project-types/cdk8s-app/)** | CDK8s applications with Kubernetes | Building and deploying Kubernetes applications |

## 🧩 Available Components

| Component | Description | Documentation |
|-----------|-------------|---------------|
| **[CDK8s Component](https://jumptothecloud.github.io/projen-project-types/components/cdk8s/)** | Kubernetes manifest generation with TypeScript | Add to any project type |
| **[Commitzent Component](https://jumptothecloud.github.io/projen-project-types/components/commitzent/)** | Conventional Commits with interactive prompts | Included by default |

## ⚡ What You Get Out of the Box

Every project template includes:

- 🎨 **[Prettier](https://jumptothecloud.github.io/projen-project-types/default-configurations/#prettier-configuration)** - Consistent code formatting
- 🔧 **[VSCode Setup](https://jumptothecloud.github.io/projen-project-types/default-configurations/#vscode-configuration)** - Optimized editor experience with recommended extensions
- 📋 **[Commitzent](https://jumptothecloud.github.io/projen-project-types/components/commitzent/)** - Conventional commits with interactive prompts
- 📝 **TypeScript** - Best practices and configurations
- 🧪 **Jest Testing** - Ready-to-use testing framework
- 🚢 **CI/CD Pipelines** - GitHub Actions workflows
- 📚 **Documentation** - Auto-generated API docs
- 🔒 **Security** - Dependabot and security scanning

## 💡 Example Usage

### CDK Library with Custom Configuration

```typescript
// .projenrc.ts
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'my-awesome-constructs',
  author: 'Your Name',
  authorAddress: 'your@email.com',
  repositoryUrl: 'https://github.com/yourusername/my-awesome-constructs.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // Customize as needed
  prettier: true,
  vscode: true,
});

project.synth();
```

### CDK8s Library with Kubernetes Support

```typescript
// .projenrc.ts
import { Cdk8sLibrary, K8sVersion } from '@jttc/projen-project-types';

const project = new Cdk8sLibrary({
  name: 'my-k8s-constructs',
  author: 'Your Name', 
  authorAddress: 'your@email.com',
  repositoryUrl: 'https://github.com/yourusername/my-k8s-constructs.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // CDK8s specific options
  k8sVersion: K8sVersion.V1_31,
  appPath: 'src/k8s',
  imports: ['cert-manager@v1.13.0'],
});

project.synth();
```

## 🏗️ Architecture

```
projen-project-types/
├── 📁 Project Types/          # Complete project templates
│   ├── CDK Library           # AWS CDK construct libraries
│   ├── CDK App              # AWS CDK applications  
│   └── CDK8s Library        # Kubernetes + CDK8s libraries
├── 🧩 Components/            # Reusable functionality
│   └── CDK8s Component      # Kubernetes manifest generation
└── ⚙️  Common Config/        # Shared configurations
    ├── Prettier             # Code formatting
    ├── VSCode              # Editor setup
    └── TypeScript          # Language configuration
```

## 📚 Documentation

Comprehensive documentation is available at: **[jumptothecloud.github.io/projen-project-types](https://jumptothecloud.github.io/projen-project-types/)**

- **[Getting Started Guide](https://jumptothecloud.github.io/projen-project-types/)**
- **[Project Types](https://jumptothecloud.github.io/projen-project-types/project-types/cdk-library/)**
- **[Components](https://jumptothecloud.github.io/projen-project-types/components/cdk8s/)**  
- **[Default Configurations](https://jumptothecloud.github.io/projen-project-types/default-configurations/)**

## 🛠️ Development

### Prerequisites

- **Node.js** (v18+)
- **Yarn** package manager
- **Python 3** (for documentation)

### Setup

```bash
# Clone the repository
git clone https://github.com/JumpToTheCloud/projen-project-types.git
cd projen-project-types

# Install dependencies
yarn install

# Run tests
yarn test

# Build the project
yarn build
```

### Documentation Development

```bash
# Install documentation dependencies
pip3 install mkdocs mkdocs-material mike

# Serve documentation locally with hot reload
yarn docs:serve

# Build documentation
yarn docs:build
```

The documentation will be available at `http://localhost:8099` when using the serve command.

## 🗺️ Roadmap

Planned features and project types:

- **Next.js Projects** - Full-stack TypeScript applications
- **Node.js APIs** - REST and GraphQL API templates
- **React Libraries** - Component library templates  
- **Terraform Modules** - Infrastructure as Code templates
- **Docker Components** - Containerization support
- **Serverless Functions** - AWS Lambda and other FaaS templates

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `yarn test`
5. **Update documentation** if needed
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Contribution Guidelines

- All new features should include tests
- Documentation should be updated for new project types or components
- Follow the existing code style and patterns
- Ensure all CI checks pass

## ❓ Support

- **Documentation**: [jumptothecloud.github.io/projen-project-types](https://jumptothecloud.github.io/projen-project-types/)
- **Issues**: [GitHub Issues](https://github.com/JumpToTheCloud/projen-project-types/issues)
- **Discussions**: [GitHub Discussions](https://github.com/JumpToTheCloud/projen-project-types/discussions)

## 📄 License

This project is licensed under the **Apache 2.0 License** - see the [LICENSE](LICENSE) file for details.

## 🌟 Credits

Built with ❤️ by the [JumpToTheCloud](https://github.com/JumpToTheCloud) team.

Special thanks to the [projen](https://projen.io) community for creating such an amazing tool for project configuration management.