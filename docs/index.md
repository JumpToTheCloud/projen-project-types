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

Choose from our available project types:

### 🏗️ [CDK Library Project](project-types/cdk-library.md)

Create AWS CDK construct libraries with opinionated configurations:

- Pre-configured Prettier settings
- VSCode workspace setup with recommended extensions
- Best practices for CDK library development
- Fully customizable while maintaining sensible defaults

```bash linenums="1" title="Create new CDK Library project"
# Create a new CDK Library project
npx projen new --from @jttc/projen-project-types cdk-library
```

!!! tip "Getting Started"
    After running the command above, follow the interactive prompts to configure your project, then customize further by editing `.projenrc.ts`

More project types are planned for future releases!

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to help improve these project types.

## License

This project is licensed under the terms specified in the LICENSE file.
