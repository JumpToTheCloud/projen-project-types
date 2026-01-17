import { Component, Project, TextFile } from 'projen';

export interface AgentsOptions {
  /**
   * Custom content to include in the AGENTS.md file
   */
  readonly customContent?: string[];
}

/**
 * Component that adds an AGENTS.md file to explain how the repository works
 * for coding agents like GitHub Copilot
 */
export class Agents extends Component {
  constructor(project: Project, id: string, options?: AgentsOptions) {
    super(project, id);

    new TextFile(project, 'AGENTS.md', {
      lines: this.generateAgentsContent(project, options),
    });
  }

  private detectProjectType(
    project: Project,
  ):
    | 'cdk-app'
    | 'cdk-library'
    | 'cdk8s-app'
    | 'cdk8s-library'
    | 'monorepo'
    | 'typescript' {
    const projectName = project.constructor.name;

    // Check if the project has specific components that identify the type
    const hasCdk8sComponent = project.node.children.some(
      (child) => child.constructor.name === 'Cdk8sComponent',
    );

    const hasMonorepoFeatures = project.node.children.some(
      (child) => child.constructor.name === 'NxConfigurations',
    );

    // Specific class name checks
    if (projectName === 'CdkApp') return 'cdk-app';
    if (projectName === 'CdkLibrary') return 'cdk-library';
    if (projectName === 'Cdk8App') return 'cdk8s-app';
    if (projectName === 'Cdk8sLibrary') return 'cdk8s-library';
    if (projectName === 'NxMonorepo') return 'monorepo';

    // Fallback to component-based detection
    if (hasCdk8sComponent && projectName.includes('Library')) {
      return 'cdk8s-library';
    }
    if (hasCdk8sComponent) return 'cdk8s-app';
    if (hasMonorepoFeatures) return 'monorepo';
    if (
      projectName.includes('CdkApp') ||
      projectName.includes('AwsCdkTypeScriptApp')
    ) {
      return 'cdk-app';
    }
    if (
      projectName.includes('CdkLibrary') ||
      projectName.includes('AwsCdkConstructLibrary')
    ) {
      return 'cdk-library';
    }

    return 'typescript';
  }

  private generateAgentsContent(
    project: Project,
    options?: AgentsOptions,
  ): string[] {
    const projectType = this.detectProjectType(project);

    const baseContent = [
      '# Coding Agents Guide',
      '',
      'This file contains essential information about how this repository works for coding agents like GitHub Copilot.',
      '',
      '## Repository Overview',
      '',
      `This is the **${project.name}** project, which uses [Projen](https://projen.io/) for project configuration management.`,
      '',
      '## What is Projen?',
      '',
      'Projen is a tool that allows managing project configuration through TypeScript code instead of static configuration files.',
      '',
      '### Key Features:',
      '- **Configuration as Code**: Everything is defined in `.projenrc.ts`',
      '- **Automatic Management**: Automatically regenerates configuration files',
      '- **Extensible**: Allows creating reusable components',
      '- **Consistency**: Keeps configuration synchronized',
      '',
      ...this.getProjectSpecificContent(projectType),
      '',
      '## Important Commands',
      '',
      '```bash',
      '# Regenerate configuration files from .projenrc.ts',
      'npx projen',
      '',
      '# Build the project',
      'npx projen build',
      '',
      '# Run tests',
      'npx projen test',
      '',
      '# Run tests in watch mode',
      'npx projen test:watch',
      '',
      '# Lint the code',
      'npx projen eslint',
      '',
      '# Package the project',
      'npx projen package',
      '',
      '# Clean generated files',
      'npx projen clobber',
      '',
      '# Upgrade dependencies',
      'npx projen upgrade',
      '```',
      '',
      ...this.getProjectCommands(projectType),
      '',
      '## Dependency Management',
      '',
      '### Adding Dependencies:',
      '```typescript',
      '// In the project or component constructor',
      'project.deps.addDependency("package-name", DependencyType.BUILD);',
      'project.deps.addDependency("package-name", DependencyType.RUNTIME);',
      'project.deps.addDependency("package-name", DependencyType.PEER);',
      '```',
      '',
      '### Dependency Types:',
      '- `RUNTIME`: Runtime dependencies (dependencies)',
      '- `BUILD`: Build dependencies (devDependencies)',
      '- `PEER`: Peer dependencies (peerDependencies)',
      '',
      '## Project Structure',
      '',
      this.getProjectStructure(projectType),
      '',
      ...this.getProjectTypeSpecificSections(projectType),
      '',
      '## Common Configuration',
      '',
      '- **CommonOptionsConfig**: Manages default configurations',
      '- **Prettier**: Automatic code formatting',
      '- **ESLint**: Automatic linting',
      '- **VSCode**: Configuration and recommended extensions',
      '- **Commitzent**: Conventional commits',
      '- **Agents**: This documentation for coding agents',
      '',
      '## Important Files',
      '',
      '- `.projenrc.ts`: Main project configuration',
      '- `package.json`: Generated automatically by Projen',
      '- `tsconfig.json`: TypeScript configuration',
      '- `.gitignore`: Files ignored by Git',
      '',
      '## Best Practices',
      '',
      '1. **Never edit generated files**: Always modify the source in `.projenrc.ts`',
      '2. **Run `npx projen`** after configuration changes',
      '3. **Use components** for reusable functionality',
      '4. **Follow naming conventions** established in the project',
      '5. **Document changes** in tests and README',
      '',
      '## Troubleshooting',
      '',
      '### Error: "File is read-only"',
      '- Files generated by Projen are read-only',
      '- Modify the configuration in `.projenrc.ts` instead',
      '',
      '### Dependencies not found',
      '- Run `npx projen` to install dependencies',
      '- Verify dependencies are in `.projenrc.ts`',
      '',
      '### Tests fail',
      '- Run `npx projen build` to compile changes',
      '- Verify snapshots are updated',
      '',
      '## Useful Resources',
      '',
      '- [Projen Documentation](https://projen.io/)',
      '- [Projen API Reference](https://github.com/projen/projen/blob/main/API.md)',
      ...this.getProjectSpecificResources(projectType),
      '',
      '---',
      '',
      '> This file is automatically generated by the `Agents` component.',
      '> To modify it, edit the component in `src/components/agents/agents.ts`.',
    ];

    if (options?.customContent) {
      baseContent.push('', '## Custom Content', '', ...options.customContent);
    }

    return baseContent;
  }

  private getProjectSpecificContent(projectType: string): string[] {
    switch (projectType) {
      case 'cdk-app':
        return [
          '## CDK Application Project',
          '',
          'This is an AWS CDK TypeScript application project that allows you to deploy cloud infrastructure.',
          '',
          '### CDK Specific Features:',
          '- **Infrastructure as Code**: Define AWS resources in TypeScript',
          '- **Multiple Environments**: Support for dev, staging, prod',
          '- **CDK Constructs**: Reusable cloud components',
          '- **AWS Integration**: Native AWS service integration',
        ];

      case 'cdk-library':
        return [
          '## CDK Construct Library Project',
          '',
          'This is an AWS CDK construct library project for creating reusable cloud components.',
          '',
          '### CDK Library Features:',
          '- **Reusable Constructs**: Create shareable AWS components',
          '- **Multi-Language Support**: Generate bindings for multiple languages',
          '- **JSII Compilation**: Cross-platform compatibility',
          '- **NPM Publishing**: Distribute via package managers',
        ];

      case 'cdk8s-app':
        return [
          '## CDK8s Application Project',
          '',
          'This is a CDK8s TypeScript application for generating Kubernetes manifests.',
          '',
          '### CDK8s Features:',
          '- **Kubernetes as Code**: Define K8s resources in TypeScript',
          '- **Type Safety**: Compile-time validation of manifests',
          '- **Reusable Charts**: Create sharable Kubernetes components',
          '- **Multi-Cluster**: Deploy to multiple Kubernetes clusters',
        ];

      case 'cdk8s-library':
        return [
          '## CDK8s Construct Library Project',
          '',
          'This is a CDK8s construct library for creating reusable Kubernetes components.',
          '',
          '### CDK8s Library Features:',
          '- **Reusable Charts**: Create shareable Kubernetes constructs',
          '- **Custom Resources**: Define custom Kubernetes operators',
          '- **Helm Integration**: Work with existing Helm charts',
          '- **Multi-Language**: Generate for different programming languages',
        ];

      case 'monorepo':
        return [
          '## Monorepo Project',
          '',
          'This is a monorepo project that contains multiple related packages and applications.',
          '',
          '### Monorepo Features:',
          '- **Multiple Packages**: Manage related projects together',
          '- **Shared Dependencies**: Efficient dependency management',
          '- **Cross-Package Scripts**: Coordinated builds and deployments',
          '- **Workspace Management**: Lerna/Nx integration',
        ];

      default:
        return [
          '## TypeScript Project',
          '',
          'This is a TypeScript project managed by Projen.',
          '',
          '### TypeScript Features:',
          '- **Type Safety**: Compile-time type checking',
          '- **Modern JavaScript**: Latest ECMAScript features',
          '- **Build Tools**: Automated compilation and bundling',
          '- **Testing**: Comprehensive test framework integration',
        ];
    }
  }

  private getProjectCommands(projectType: string): string[] {
    const commonCommands = ['## Project-Specific Commands', ''];

    switch (projectType) {
      case 'cdk-app':
        return [
          ...commonCommands,
          '```bash',
          '# Deploy CDK stack',
          'npx cdk deploy',
          '',
          '# Show differences with deployed stack',
          'npx cdk diff',
          '',
          '# Destroy CDK stack',
          'npx cdk destroy',
          '',
          '# Synthesize CloudFormation template',
          'npx cdk synth',
          '```',
        ];

      case 'cdk-library':
        return [
          ...commonCommands,
          '```bash',
          '# Build and package library',
          'npx projen package',
          '',
          '# Generate API documentation',
          'npx projen docgen',
          '',
          '# Check compatibility',
          'npx projen compat',
          '',
          '# Publish to NPM',
          'npx projen release',
          '```',
        ];

      case 'cdk8s-app':
        return [
          ...commonCommands,
          '```bash',
          '# Synthesize Kubernetes manifests',
          'npx cdk8s synth',
          '',
          '# Apply to Kubernetes cluster',
          'kubectl apply -f dist/',
          '',
          '# Import Kubernetes API objects',
          'npx cdk8s import',
          '```',
        ];

      case 'monorepo':
        return [
          ...commonCommands,
          '```bash',
          '# Build all packages',
          'npx projen build',
          '',
          '# Test all packages',
          'npx projen test',
          '',
          '# Package all packages',
          'npx projen package-all',
          '',
          '# Run task in specific package',
          'npx nx run <package>:<task>',
          '```',
        ];

      default:
        return [];
    }
  }

  private getProjectStructure(projectType: string): string {
    switch (projectType) {
      case 'cdk-app':
        return [
          '```',
          'src/                 # CDK application source code',
          '├── main.ts          # Main CDK app entry point',
          '├── stacks/          # CDK stack definitions',
          '└── constructs/      # Custom CDK constructs',
          '',
          'test/                # Unit and integration tests',
          'cdk.out/             # CDK synthesis output (generated)',
          'lib/                 # Compiled TypeScript (generated)',
          '```',
        ].join('\n');

      case 'cdk-library':
        return [
          '```',
          'src/                 # Library source code',
          '├── index.ts         # Main library exports',
          '└── constructs/      # CDK construct implementations',
          '',
          'test/                # Unit tests and examples',
          'lib/                 # Compiled TypeScript (generated)',
          'dist/                # Distribution packages (generated)',
          'API.md               # Generated API documentation',
          '```',
        ].join('\n');

      case 'monorepo':
        return [
          '```',
          'packages/            # Individual packages in the monorepo',
          '├── package-1/       # First package',
          '├── package-2/       # Second package',
          '└── shared/          # Shared utilities',
          '',
          'apps/                # Applications in the monorepo',
          'tools/               # Build tools and scripts',
          'docs/                # Documentation',
          '```',
        ].join('\n');

      default:
        return [
          '```',
          'src/                 # Source code',
          '├── index.ts         # Main entry point',
          '└── lib/             # Library code',
          '',
          'test/                # Unit tests',
          'lib/                 # Compiled TypeScript (generated)',
          'dist/                # Distribution files (generated)',
          '```',
        ].join('\n');
    }
  }

  private getProjectTypeSpecificSections(projectType: string): string[] {
    switch (projectType) {
      case 'cdk-app':
        return [
          '## Creating New CDK Stacks',
          '',
          '### 1. Basic Stack:',
          '```typescript',
          'import { Stack, StackProps } from "aws-cdk-lib";',
          'import { Construct } from "constructs";',
          '',
          'export class MyStack extends Stack {',
          '  constructor(scope: Construct, id: string, props?: StackProps) {',
          '    super(scope, id, props);',
          '    ',
          '    // Add AWS resources here',
          '  }',
          '}',
          '```',
          '',
          '### 2. Add to App:',
          '```typescript',
          '// In main.ts',
          'new MyStack(app, "MyStack");',
          '```',
        ];

      case 'cdk-library':
        return [
          '## Creating New Constructs',
          '',
          '### 1. Basic Construct:',
          '```typescript',
          'import { Construct } from "constructs";',
          '',
          'export interface MyConstructProps {',
          '  // Define props here',
          '}',
          '',
          'export class MyConstruct extends Construct {',
          '  constructor(scope: Construct, id: string, props: MyConstructProps) {',
          '    super(scope, id);',
          '    ',
          '    // Implement construct logic',
          '  }',
          '}',
          '```',
        ];

      case 'monorepo':
        return [
          '## Working with Packages',
          '',
          '### Adding New Package:',
          '1. Create package directory in `packages/`',
          '2. Add package configuration to monorepo',
          '3. Update workspace dependencies',
          '',
          '### Inter-Package Dependencies:',
          '```typescript',
          '// Reference another package in the monorepo',
          'import { utility } from "@workspace/shared";',
          '```',
        ];

      default:
        return [];
    }
  }

  private getProjectSpecificResources(projectType: string): string[] {
    switch (projectType) {
      case 'cdk-app':
      case 'cdk-library':
        return [
          '- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)',
          '- [CDK API Reference](https://docs.aws.amazon.com/cdk/api/v2/)',
        ];

      case 'cdk8s-app':
      case 'cdk8s-library':
        return [
          '- [CDK8s Documentation](https://cdk8s.io/)',
          '- [Kubernetes Documentation](https://kubernetes.io/docs/)',
        ];

      case 'monorepo':
        return [
          '- [Nx Documentation](https://nx.dev/)',
          '- [Lerna Documentation](https://lerna.js.org/)',
        ];

      default:
        return [];
    }
  }
}
