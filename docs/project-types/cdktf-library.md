# CDKTF Library Project

The CDKTF (CDK for Terraform) Library Project type provides an opinionated setup for creating CDKTF construct libraries with best practices and common configurations pre-configured.

## Overview

This project type extends the standard `ConstructLibraryCdktf` from projen with additional features:

- **Prettier configuration** with sensible defaults
- **VSCode settings and extensions** for enhanced development experience  
- **Common project structure** and tooling setup
- **Configurable options** that respect user preferences
- **CDKTF-specific** tooling and dependencies
- **Multi-language support** via JSII

## Quick Start

To create a new CDKTF Library project, use the projen CLI:

```bash linenums="1"
npx projen new --from @jttc/projen-project-types cdktf-library
```

This command will create a new project with the CDKTF Library template and prompt you for the required configuration options such as:

- Project name
- Author information
- Repository URL
- CDKTF version
- Default branch

After the project is created, you can customize it further by editing the `.projenrc.ts` file:

```typescript linenums="1" title=".projenrc.ts" hl_lines="4 8 12 13"
import { CdktfLibrary } from '@jttc/projen-project-types';

const project = new CdktfLibrary({
  name: 'my-awesome-cdktf-library',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/my-awesome-cdktf-library.git',
  defaultReleaseBranch: 'main',
  
  // Add any additional customizations here
  prettier: true,
  vscode: true,
});

project.synth();
```

## Key Features

### CDKTF Integration

The CDKTF Library comes with CDKTF-specific configurations:

- Pre-configured CDKTF and Constructs dependencies
- TypeScript configuration optimized for CDKTF
- JSII configuration for multi-language support
- Appropriate peer dependencies for Terraform providers

### Multi-Language Support

Through JSII, your CDKTF library can be used in multiple programming languages:

```typescript linenums="1" title=".projenrc.ts"
import { CdktfLibrary } from '@jttc/projen-project-types';

const project = new CdktfLibrary({
  name: 'my-cdktf-library',
  // ... other options
  
  // Enable Python publishing
  publishToPypi: {
    distName: 'my-cdktp-library',
    module: 'my_cdktp_library',
  },
  
  // Enable Java publishing
  publishToMaven: {
    javaPackage: 'com.example.cdktp',
    mavenGroupId: 'com.example',
    mavenArtifactId: 'my-cdktp-library',
  },
  
  // Enable .NET publishing
  publishToNuget: {
    dotNetNamespace: 'Example.Cdktp',
    packageId: 'Example.Cdktp.Library',
  },
});

project.synth();
```

### Development Experience

The project includes VSCode configuration for an optimal development experience:

- Recommended extensions for CDKTF development
- TypeScript and ESLint configurations
- Prettier for consistent code formatting
- Git hooks for conventional commits (via Commitzent)

## Configuration Options

### CdktfLibraryOptions

The `CdktfLibraryOptions` interface extends `ConstructLibraryCdktfOptions` and `ProjectGlobalOptions`, providing all the standard CDKTF library configuration options plus:

```typescript
export interface CdktfLibraryOptions
  extends ConstructLibraryCdktfOptions, ProjectGlobalOptions {
  // Future CDKTF Library specific options can be added here
}
```

### Common Options

All projects created with this template support these common options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `commitzent` | `boolean` | `true` | Enable Commitzent for conventional commits |
| `prettier` | `boolean` | `true` | Enable Prettier for code formatting |
| `vscode` | `boolean` | `true` | Include VSCode settings and recommendations |

### CDKTF Specific Options

Additional CDKTF-specific configuration options inherited from `ConstructLibraryCdktfOptions`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cdktfVersion` | `string` | `"^0.13.0"` | Minimum CDKTF version to target |
| `constructsVersion` | `string` | `"^10.3.0"` | Constructs library version |
| `catalog` | `Catalog` | Enabled | Library catalog configuration |

## Project Structure

A CDKTF Library project includes these key files and directories:

```
my-cdktf-library/
├── .github/           # GitHub workflows and templates
├── .vscode/           # VSCode settings and extensions
├── src/               # Source code directory
├── test/              # Test files
├── .eslintrc.json     # ESLint configuration
├── .gitignore         # Git ignore patterns
├── .prettierrc.json   # Prettier configuration
├── package.json       # NPM package configuration
├── tsconfig.json      # TypeScript configuration
├── tsconfig.dev.json  # Development TypeScript config
└── .projenrc.ts       # Projen configuration
```

## Examples

### Basic CDKTF Library

```typescript linenums="1" title=".projenrc.ts"
import { CdktfLibrary } from '@jttc/projen-project-types';

const project = new CdktfLibrary({
  name: 'terraform-constructs-aws',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/terraform-constructs-aws.git',
  description: 'AWS constructs for CDK for Terraform',
  keywords: ['cdktf', 'terraform', 'aws', 'constructs'],
  defaultReleaseBranch: 'main',
});

project.synth();
```

### Multi-Language CDKTF Library

```typescript linenums="1" title=".projenrc.ts"
import { CdktfLibrary } from '@jttc/projen-project-types';

const project = new CdktfLibrary({
  name: 'terraform-kubernetes-constructs',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/terraform-kubernetes-constructs.git',
  description: 'Kubernetes constructs for CDK for Terraform',
  defaultReleaseBranch: 'main',
  
  // Multi-language support
  publishToPypi: {
    distName: 'terraform-kubernetes-constructs',
    module: 'terraform_kubernetes_constructs',
  },
  
  publishToMaven: {
    javaPackage: 'com.example.terraform.kubernetes',
    mavenGroupId: 'com.example',
    mavenArtifactId: 'terraform-kubernetes-constructs',
  },
  
  publishToNuget: {
    dotNetNamespace: 'Example.Terraform.Kubernetes',
    packageId: 'Example.Terraform.Kubernetes.Constructs',
  },
});

project.synth();
```

### CDKTF Library with Custom Dependencies

```typescript linenums="1" title=".projenrc.ts"
import { CdktfLibrary } from '@jttc/projen-project-types';

const project = new CdktfLibrary({
  name: 'advanced-cdktf-library',
  author: 'Your Name',
  authorAddress: 'your.email@example.com',
  repositoryUrl: 'https://github.com/yourusername/advanced-cdktf-library.git',
  defaultReleaseBranch: 'main',
  
  // Custom CDKTF version
  cdktfVersion: '^0.15.0',
  
  // Additional dependencies
  deps: [
    '@cdktf/provider-aws',
    '@cdktf/provider-kubernetes',
  ],
  
  // Development dependencies
  devDeps: [
    '@types/node',
    'typescript',
  ],
  
  // Disable commitzent if not needed
  commitzent: false,
});

project.synth();
```

## Best Practices

### 1. Construct Naming

Follow CDKTF naming conventions for your constructs:

```typescript
// Good
export class S3Bucket extends Construct { ... }
export class VpcEndpoint extends Construct { ... }

// Avoid
export class s3bucket extends Construct { ... }
export class VPC_endpoint extends Construct { ... }
```

### 2. Provider Dependencies

Declare provider dependencies as peer dependencies:

```typescript linenums="1" title=".projenrc.ts"
const project = new CdktpLibrary({
  // ...
  peerDeps: [
    '@cdktf/provider-aws@^10.0.0',
    '@cdktf/provider-kubernetes@^8.0.0',
  ],
});
```

### 3. Testing

Write comprehensive tests for your constructs:

```typescript linenums="1" title="test/s3-bucket.test.ts"
import { Testing } from 'cdktf';
import { S3Bucket } from '../src/s3-bucket';

describe('S3Bucket', () => {
  test('should create S3 bucket with default configuration', () => {
    const app = Testing.app();
    const stack = Testing.fakeCdktfStack(app, 'test-stack');
    
    new S3Bucket(stack, 'test-bucket', {
      bucketName: 'my-test-bucket',
    });
    
    const template = Testing.synth(stack);
    expect(template).toMatchSnapshot();
  });
});
```

### 4. Documentation

Include comprehensive documentation:

```typescript
/**
 * Configuration options for S3 bucket construct
 */
export interface S3BucketOptions {
  /**
   * The name of the S3 bucket
   */
  readonly bucketName: string;
  
  /**
   * Enable versioning for the bucket
   * @default false
   */
  readonly versioning?: boolean;
}

/**
 * A construct for creating S3 buckets with sensible defaults
 */
export class S3Bucket extends Construct {
  constructor(scope: Construct, id: string, options: S3BucketOptions) {
    // Implementation
  }
}
```

## Troubleshooting

### Common Issues

1. **JSII compilation errors**: Ensure all public APIs are properly documented with JSDoc comments.

2. **Provider version conflicts**: Use peer dependencies for provider packages to avoid version conflicts.

3. **TypeScript compilation errors**: Check that your `tsconfig.json` includes the correct CDKTF types.

### Useful Commands

```bash
# Build the project
npm run build

# Run tests
npm test

# Run linting
npm run eslint

# Package for distribution
npm run package

# Compile JSII for multi-language support
npm run compile
```

## Migration Guide

### From Standard CDKTF Projects

If you have an existing CDKTF library project, you can migrate to this template:

1. Install the project types package:
   ```bash
   npm install --save-dev @jttc/projen-project-types
   ```

2. Update your `.projenrc.ts`:
   ```typescript
   import { CdktfLibrary } from '@jttc/projen-project-types';
   
   const project = new CdktfLibrary({
     // Your existing options
   });
   
   project.synth();
   ```

3. Regenerate project files:
   ```bash
   npx projen
   ```

## Related Projects

- [CDK Library Project](cdk-library.md) - For AWS CDK construct libraries
- [CDK8s Library Project](cdk8s-library.md) - For Kubernetes CDK construct libraries
- [CDK App Project](cdk-app.md) - For CDKTF applications