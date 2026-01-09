# CDK Library Project

The CDK Library Project type provides an opinionated setup for creating AWS CDK construct libraries with best practices and common configurations pre-configured.

## Overview

This project type extends the standard `AwsCdkConstructLibrary` from projen with additional features:

- **Prettier configuration** with sensible defaults
- **VSCode settings and extensions** for enhanced development experience  
- **Common project structure** and tooling setup
- **Configurable options** that respect user preferences

## Quick Start

To create a new CDK Library project, use the projen CLI:

```bash linenums="1"
npx projen new --from @jttc/projen-project-types cdk-library
```

This command will create a new project with the CDK Library template and prompt you for the required configuration options such as:

- Project name
- Author information
- Repository URL
- CDK version
- Default branch

After the project is created, you can customize it further by editing the `.projenrc.ts` file:

```typescript linenums="1" title=".projenrc.ts" hl_lines="4 8 12 13"
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'my-awesome-cdk-library',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/my-awesome-cdk-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // Add any additional customizations here
  prettier: true,
  vscode: true,
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 4**: Choose a descriptive name for your CDK construct library
- **Line 8**: Pin to a specific CDK version for consistency
- **Line 12**: Enable prettier formatting (default: true)
- **Line 13**: Enable VSCode workspace configuration (default: true)

## Features

### Common Configurations

This project type includes the same common configurations as other project types:

!!! info "Default Configurations"
    For complete details about Prettier and VSCode configurations, see [Default Configurations](../default-configurations.md). This includes:
    
    - [Prettier Configuration](../default-configurations.md#prettier-configuration) - Code formatting rules and customization
    - [VSCode Configuration](../default-configurations.md#vscode-configuration) - Editor settings and recommended extensions

### CDK-Specific Features

- **AWS CDK Integration** with construct library setup
- **TypeScript configuration** optimized for CDK development
- **Publishing pipeline** ready for npm/JSR distribution
- **Testing setup** with Jest and CDK assertions

## Configuration Options

### Basic Configuration

All standard `AwsCdkConstructLibraryOptions` are supported. Here are the required options:

```typescript linenums="1" title="Basic CDK Library Configuration"
const project = new CdkLibrary({
  // Required options
  name: 'my-cdk-library',
  author: 'Your Name',
  authorAddress: 'your.email@example.com', 
  repositoryUrl: 'https://github.com/yourusername/my-cdk-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // Optional configurations (see sections below)
});
```

### Common Configuration Options

For Prettier and VSCode configuration options, refer to [Default Configurations](../default-configurations.md):

- **Prettier**: [Customization Guide](../default-configurations.md#customization)
- **VSCode**: [Configuration Options](../default-configurations.md#customization)

## Examples

### Minimal Setup

Perfect for getting started quickly with all defaults:

```typescript linenums="1" title=".projenrc.ts - Minimal Setup"
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'simple-cdk-library',
  author: 'John Doe',
  authorAddress: 'john@example.com',
  repositoryUrl: 'https://github.com/johndoe/simple-cdk-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  // All other options use sensible defaults
});

project.synth();
```

### Customized Setup

Example with custom prettier settings and additional CDK options:

```typescript linenums="1" title=".projenrc.ts - Advanced Configuration" hl_lines="11 12 18 19 20"
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'advanced-cdk-library',
  author: 'Jane Smith',
  authorAddress: 'jane@company.com',
  repositoryUrl: 'https://github.com/company/advanced-cdk-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // Custom prettier settings
  prettierOptions: {
    settings: {
      printWidth: 120,
      tabWidth: 4,
    },
  },
  
  // Enable VSCode (explicit)
  vscode: true,
  
  // Additional CDK library options
  description: 'An advanced CDK construct library',
  keywords: ['aws', 'cdk', 'constructs'],
  license: 'MIT',
});

project.synth();
```

**Highlighted lines explanation:**

- **Lines 11-16**: Custom prettier settings for longer lines and 4-space indentation
- **Line 19**: Enable VSCode configuration explicitly
- **Lines 22-24**: Additional NPM package metadata for discoverability

### Development-Only Setup

Optimized for local development with minimal tooling:

```typescript linenums="1" title=".projenrc.ts - Development Focus" hl_lines="11 12"
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'dev-cdk-library',
  author: 'Developer',
  authorAddress: 'dev@localhost.com', 
  repositoryUrl: 'https://github.com/dev/dev-cdk-library.git',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  prettier: false,
  vscode: true,
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 11**: Skip prettier for faster development iterations
- **Line 12**: Keep VSCode config for better developer experience

## Project Structure

After running `yarn projen` with a CDK Library project, you'll get the following structure:

```text title="Generated Project Structure"
my-cdk-library/
├── .github/
│   └── workflows/              # CI/CD workflows
│       ├── build.yml
│       ├── release.yml
│       └── upgrade-main.yml
├── .vscode/                    # VSCode configuration (if enabled)
│   ├── extensions.json         # Recommended extensions
│   └── settings.json          # Editor settings
├── src/
│   └── index.ts               # Main library entry point
├── test/
│   └── *.test.ts              # Test files
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc.json           # Prettier config (if enabled)
├── .projenrc.ts              # Projen configuration
├── package.json              # NPM package configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Generated README
```

!!! info "Conditional Files"
    Some files are only created based on your configuration:
    
    - `.vscode/` folder: Only when `vscode: true` (default)
    - `.prettierrc.json`: Only when `prettier: true` (default)

## Best Practices

### 1. Use Consistent Configurations

Stick with the default prettier and VSCode configurations unless you have specific requirements. This ensures consistency across your team and projects.

### 2. Leverage VSCode Extensions

The recommended extensions provide significant productivity improvements for CDK development. Make sure your team installs them.

### 3. Customize Thoughtfully

While customization is available, consider whether deviating from defaults provides real value. Consistency often trumps personal preferences in team environments.

### 4. Version Lock Your CDK Version

Always specify a specific CDK version to ensure consistent builds across environments:

```typescript
cdkVersion: '2.1.0', // Good - specific version
// cdkVersion: '^2.0.0', // Avoid - could lead to inconsistencies
```

## Troubleshooting

### Prettier Not Working

If prettier isn't formatting your code:

1. Ensure the prettier extension is installed in VSCode
2. Check that `"editor.defaultFormatter": "esbenp.prettier-vscode"` is in your VSCode settings
3. Verify `.prettierrc.json` exists in your project root

### VSCode Extensions Not Recommended

If VSCode isn't showing extension recommendations:

1. Check that `.vscode/extensions.json` exists
2. Restart VSCode
3. Go to Extensions panel and look for the "Recommended" section

### Build Errors

If you encounter build errors after setup:

1. Run `yarn install` to ensure all dependencies are installed
2. Run `yarn projen` to regenerate configuration files
3. Check that your CDK version is compatible with your constructs version

## Migration Guide

### From Standard AwsCdkConstructLibrary

To migrate from a standard `AwsCdkConstructLibrary` to `CdkLibrary`:

1. Install the package: `npm install @jttc/projen-project-types`
2. Update your `.projenrc.ts`:

```diff
- import { AwsCdkConstructLibrary } from 'projen/lib/awscdk';
+ import { CdkLibrary } from '@jttc/projen-project-types';

- const project = new AwsCdkConstructLibrary({
+ const project = new CdkLibrary({
  // ... same options
});
```

3. Run `yarn projen` to regenerate files
4. Commit the changes

The migration is backward compatible - all existing options will continue to work.

## Contributing

To contribute improvements to the CDK Library project type:

1. Fork the repository
2. Make your changes
3. Add tests for new functionality
4. Update documentation
5. Submit a pull request

## Support

If you encounter issues or have questions:

- Check this documentation
- Review existing GitHub issues
- Create a new issue with detailed information
- Tag the maintainers for urgent issues

---

*This project type is maintained by [Jump to the Cloud](https://jumptothecloud.tech) team.*