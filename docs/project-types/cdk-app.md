# CDK App Project

The CDK App Project type provides an opinionated setup for creating AWS CDK applications with best practices and common configurations pre-configured.

## Overview

This project type extends the standard `AwsCdkTypeScriptApp` from projen with additional features:

- **Prettier configuration** with sensible defaults
- **VSCode settings and extensions** for enhanced development experience  
- **Common project structure** and tooling setup
- **Configurable options** that respect user preferences
- **CDK app-specific setup** with sample application code

## Quick Start

To create a new CDK App project, use the projen CLI:

```bash linenums="1"
npx projen new --from @jttc/projen-project-types cdk-app
```

This command will create a new project with the CDK App template and prompt you for the required configuration options such as:

- Project name
- CDK version
- Default branch

After the project is created, you can customize it further by editing the `.projenrc.ts` file:

```typescript linenums="1" title=".projenrc.ts" hl_lines="4 6 10 11"
import { CdkApp } from '@jttc/projen-project-types';

const project = new CdkApp({
  name: 'my-awesome-cdk-app',
  defaultReleaseBranch: 'main',
  cdkVersion: '2.1.0',
  
  // Add any additional customizations here
  prettier: true,
  vscode: true,
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 4**: Choose a descriptive name for your CDK application
- **Line 6**: Pin to a specific CDK version for consistency
- **Line 10**: Enable prettier formatting (default: true)
- **Line 11**: Enable VSCode workspace configuration (default: true)

## Features

### Automatic Prettier Configuration

The CDK App project automatically configures Prettier with opinionated settings. For detailed information about the default prettier configuration used across all project types, see [Default Configurations](../default-configurations.md#prettier-configuration).

#### Summary of Default Settings

- **Single quotes** for strings
- **Trailing commas** (ES5 style) 
- **Bracket spacing** enabled
- **Semicolons** required

!!! tip "View Complete Configuration"
    See the [Default Configurations](../default-configurations.md#prettier-configuration) page for the complete prettier setup and customization options.

### VSCode Integration

When enabled, the project automatically sets up VSCode configuration with settings and recommended extensions optimized for CDK development. For complete details about VSCode configuration, see [Default Configurations](../default-configurations.md#vscode-configuration).

#### Key Features

- Format on save enabled
- Prettier as default formatter
- ESLint integration
- AWS and Git development extensions
- Proper indentation and editor settings

### CDK App Structure

The CDK App project creates a complete application structure with:

- **Main application entry point** (`src/main.ts`)
- **CDK configuration** (`cdk.json`)
- **Sample stack** (optional via `sampleCode` option)
- **Deployment scripts** and configuration
- **Proper TypeScript setup** for CDK apps

## Configuration Options

### Basic Configuration

All standard `AwsCdkTypeScriptAppOptions` are supported. Here are the most common options:

```typescript linenums="1" title="Basic CDK App Configuration"
const project = new CdkApp({
  // Required options
  name: 'my-cdk-app',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  
  // Optional configurations (see sections below)
});
```

### Prettier Configuration

#### Enable/Disable Prettier

```typescript linenums="1" title="Disable Prettier" hl_lines="3"
const project = new CdkApp({
  // ... other options
  prettier: false,
});
```

**Highlighted line explanation:**

- **Line 3**: Disables prettier entirely - no `.prettierrc.json` file will be created

#### Custom Prettier Options

```typescript linenums="1" title="Custom Prettier Configuration" hl_lines="5 6 7 8 9"
const project = new CdkApp({
  // ... other options
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: false,
      semi: false,
      tabWidth: 4,
      trailingComma: 'none',
      printWidth: 120,
    },
  },
});
```

**Highlighted lines explanation:**

- **Line 6**: Use double quotes instead of single quotes
- **Line 7**: Omit semicolons
- **Line 8**: Use 4 spaces for indentation instead of 2
- **Line 9**: No trailing commas
- **Line 10**: Allow longer lines (120 characters instead of 80)

### VSCode Configuration

#### Enable/Disable VSCode Setup

=== "Default Behavior (Recommended)"

    ```typescript linenums="1" title="VSCode Enabled by Default"
    const project = new CdkApp({
      // ... other options
      // vscode: undefined (defaults to enabled)
    });
    ```

=== "Explicitly Enable"

    ```typescript linenums="1" title="Explicitly Enable VSCode" hl_lines="3"
    const project = new CdkApp({
      // ... other options
      vscode: true,
    });
    ```

    **Highlighted line explanation:**
    
    - **Line 3**: Same as default behavior, but explicit

=== "Disable VSCode"

    ```typescript linenums="1" title="Disable VSCode Configuration" hl_lines="3"
    const project = new CdkApp({
      // ... other options
      vscode: false,
    });
    ```

    **Highlighted line explanation:**
    
    - **Line 3**: No `.vscode/` folder will be created

### Sample Code Configuration

#### Enable/Disable Sample Code

=== "Default Behavior (Enabled)"

    ```typescript linenums="1" title="Sample Code Enabled by Default"
    const project = new CdkApp({
      // ... other options
      // sampleCode: undefined (defaults to enabled)
    });
    ```

=== "Disable Sample Code"

    ```typescript linenums="1" title="Disable Sample Code" hl_lines="3"
    const project = new CdkApp({
      // ... other options
      sampleCode: false,
    });
    ```

    **Highlighted line explanation:**
    
    - **Line 3**: No sample application code will be generated

### Behavior Matrix

| `prettier` | `vscode` | `sampleCode` | Prettier Files | VSCode Files | Sample App Code |
|------------|----------|--------------|----------------|--------------|-----------------|
| `undefined` | `undefined` | `undefined` | ✅ Created | ✅ Created | ✅ Generated |
| `true` | `true` | `true` | ✅ Created | ✅ Created | ✅ Generated |
| `false` | `true` | `false` | ❌ Not created | ✅ Created | ❌ No sample |
| `true` | `false` | `true` | ✅ Created | ❌ Not created | ✅ Generated |
| `false` | `false` | `false` | ❌ Not created | ❌ Not created | ❌ No sample |

## Examples

### Minimal Setup

Perfect for getting started quickly with all defaults:

```typescript linenums="1" title=".projenrc.ts - Minimal Setup"
import { CdkApp } from '@jttc/projen-project-types';

const project = new CdkApp({
  name: 'simple-cdk-app',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  // All other options use sensible defaults
});

project.synth();
```

### Customized Setup

Example with custom prettier settings and disabled sample code:

```typescript linenums="1" title=".projenrc.ts - Advanced Configuration" hl_lines="8 9 15 18"
import { CdkApp } from '@jttc/projen-project-types';

const project = new CdkApp({
  name: 'advanced-cdk-app',
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
  
  // Disable sample code for clean start
  sampleCode: false,
  
  // Additional CDK app options
  context: {
    '@aws-cdk/aws-lambda:recognizeLayerVersion': true,
  },
});

project.synth();
```

**Highlighted lines explanation:**

- **Lines 8-13**: Custom prettier settings for longer lines and 4-space indentation
- **Line 16**: Enable VSCode configuration explicitly  
- **Line 19**: Disable sample code generation for a clean starting point

### Production Setup

Optimized for production deployments:

```typescript linenums="1" title=".projenrc.ts - Production Configuration" hl_lines="8 9 10 11 12"
import { CdkApp } from '@jttc/projen-project-types';

const project = new CdkApp({
  name: 'production-cdk-app',
  cdkVersion: '2.1.0', 
  defaultReleaseBranch: 'main',
  
  // Production-optimized settings
  sampleCode: false,
  prettier: true,
  vscode: true,
  
  // CDK context for production features
  context: {
    '@aws-cdk/core:enableStackNameDuplicates': true,
    '@aws-cdk/core:stackRelativeExports': true,
  },
  
  // Dependencies for common production patterns
  deps: [
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-apigateway', 
    '@aws-cdk/aws-dynamodb',
  ],
});

project.synth();
```

**Highlighted lines explanation:**

- **Line 9**: No sample code for production applications
- **Lines 10-11**: Keep development tools enabled
- **Lines 14-17**: CDK feature flags for production deployments

## Project Structure

After running `yarn projen` with a CDK App project, you'll get the following structure:

```text title="Generated Project Structure"
my-cdk-app/
├── .github/
│   └── workflows/              # CI/CD workflows
│       ├── build.yml
│       └── upgrade-main.yml
├── .vscode/                    # VSCode configuration (if enabled)
│   ├── extensions.json         # Recommended extensions
│   └── settings.json          # Editor settings
├── src/
│   └── main.ts                # Application entry point (if sampleCode enabled)
├── test/
│   └── *.test.ts              # Test files
├── .eslintrc.json             # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc.json           # Prettier config (if enabled)
├── .projenrc.ts              # Projen configuration
├── cdk.json                  # CDK configuration
├── package.json              # NPM package configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Generated README
```

!!! info "Conditional Files"
    Some files are only created based on your configuration:
    
    - `.vscode/` folder: Only when `vscode: true` (default)
    - `.prettierrc.json`: Only when `prettier: true` (default)
    - `src/main.ts`: Only when `sampleCode: true` (default)

## Deployment

### Local Development

For local development and testing:

```bash linenums="1"
# Install dependencies
yarn install

# Build the project
yarn build

# Synthesize CloudFormation templates
npx cdk synth

# Deploy to AWS (requires AWS credentials)
npx cdk deploy
```

### CI/CD Pipeline

The generated GitHub Actions workflows provide automated:

- **Build and test** on pull requests
- **Dependency updates** with automated PRs
- **Security scanning** with automated vulnerability detection

### CDK Commands

Common CDK commands you'll use:

```bash linenums="1"
# List all stacks
npx cdk list

# Show differences before deployment
npx cdk diff

# Deploy specific stack
npx cdk deploy StackName

# Destroy stack
npx cdk destroy StackName
```

## Best Practices

### 1. Use Consistent Configurations

Stick with the default prettier and VSCode configurations unless you have specific requirements. This ensures consistency across your team and projects.

### 2. Pin CDK Version

Always specify a specific CDK version to ensure consistent builds:

```typescript
cdkVersion: '2.1.0', // Good - specific version
// cdkVersion: '^2.0.0', // Avoid - could lead to inconsistencies
```

### 3. Environment-Specific Configuration

Use CDK context for environment-specific settings:

```typescript
context: {
  'myapp:environment': 'production',
  'myapp:region': 'us-east-1',
},
```

### 4. Leverage Sample Code for Learning

Keep `sampleCode: true` when learning CDK or starting new projects. Disable it for production applications.

### 5. Use Feature Flags

Enable CDK feature flags for better functionality:

```typescript
context: {
  '@aws-cdk/core:enableStackNameDuplicates': true,
  '@aws-cdk/core:stackRelativeExports': true,
},
```

## Troubleshooting

### CDK Commands Not Working

If CDK commands fail:

1. Ensure AWS credentials are configured (`aws configure`)
2. Verify CDK is installed globally (`npm install -g aws-cdk`)
3. Bootstrap your AWS environment (`npx cdk bootstrap`)

### Prettier Not Working

If prettier isn't formatting your code:

1. Ensure the prettier extension is installed in VSCode
2. Check that `"editor.defaultFormatter": "esbenp.prettier-vscode"` is in your VSCode settings
3. Verify `.prettierrc.json` exists in your project root

### Build Errors

If you encounter build errors:

1. Run `yarn install` to ensure all dependencies are installed
2. Run `yarn projen` to regenerate configuration files
3. Check TypeScript errors with `yarn build`

### Deployment Issues

Common deployment problems:

1. **Missing permissions**: Ensure your AWS credentials have sufficient permissions
2. **Resource conflicts**: Use unique resource names across environments
3. **Stack limits**: AWS has limits on resources per stack

## Migration Guide

### From Standard AwsCdkTypeScriptApp

To migrate from a standard `AwsCdkTypeScriptApp` to `CdkApp`:

1. Install the package: `npm install @jttc/projen-project-types`
2. Update your `.projenrc.ts`:

```diff
- import { AwsCdkTypeScriptApp } from 'projen/lib/awscdk';
+ import { CdkApp } from '@jttc/projen-project-types';

- const project = new AwsCdkTypeScriptApp({
+ const project = new CdkApp({
  // ... same options
});
```

3. Run `yarn projen` to regenerate files
4. Commit the changes

The migration is backward compatible - all existing options will continue to work.

## Advanced Configuration

### Custom CDK Context

Configure CDK behavior with context values:

```typescript linenums="1" title="Advanced CDK Context"
const project = new CdkApp({
  name: 'advanced-app',
  cdkVersion: '2.1.0',
  context: {
    // Feature flags
    '@aws-cdk/core:enableStackNameDuplicates': true,
    '@aws-cdk/aws-lambda:recognizeLayerVersion': true,
    
    // Custom application context
    'myapp:database-name': 'production-db',
    'myapp:api-domain': 'api.example.com',
  },
});
```

### Additional Dependencies

Add commonly used CDK modules:

```typescript linenums="1" title="Common CDK Dependencies"
const project = new CdkApp({
  name: 'full-stack-app',
  cdkVersion: '2.1.0',
  deps: [
    // Core AWS services
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-s3',
    
    // Additional tools
    '@aws-cdk/aws-route53',
    '@aws-cdk/aws-certificatemanager',
    '@aws-cdk/aws-cloudfront',
  ],
});
```

## Contributing

To contribute improvements to the CDK App project type:

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