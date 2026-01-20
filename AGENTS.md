# Agent Guidelines for Projen Project Types

This document provides essential information for AI coding agents working in this repository. The project is a TypeScript JSII library that provides opinionated Projen project templates.

## Project Overview

- **Type**: TypeScript JSII library (multi-language support)
- **Framework**: Projen for project configuration management
- **Package**: `@jttc/projen-project-types`
- **Purpose**: Provides opinionated project templates extending Projen with best practices

## Build, Test & Lint Commands

### Core Commands

```bash
# Full build pipeline (compile, lint, test, package)
yarn build

# Run tests with coverage
yarn test

# Run specific test file
yarn jest test/cdk-app.test.ts

# Run tests in watch mode
yarn test:watch

# Lint code
yarn eslint

# Compile TypeScript
yarn compile

# Generate documentation
yarn docgen

# Package for distribution
yarn package

# Preview documentation locally
yarn docs:serve
```

### Projen Commands

```bash
# Regenerate project files (run after editing .projenrc.ts)
npx projen

# Update dependencies
npx projen upgrade

# Commit with conventional commits
yarn  commit
```

## Code Style Guidelines

### TypeScript Configuration

- **Target**: ES2020
- **Module**: CommonJS (for JSII compatibility)
- **Strict mode**: Enabled with all strict flags
- **Source maps**: Inline source maps enabled
- **Declaration files**: Generated automatically

### ESLint Rules

#### Imports
- Use alphabetical import ordering: `import/order`
- No duplicate imports: `import/no-duplicates`
- Separate builtin, external imports
- Use TypeScript import resolver

#### Formatting
- **Indentation**: 2 spaces (`@stylistic/indent`)
- **Quotes**: Single quotes with escape avoidance (`@stylistic/quotes`)
- **Line length**: 150 characters max (`@stylistic/max-len`)
- **Semicolons**: Always required (`@stylistic/semi`)
- **Trailing commas**: Always on multiline (`@stylistic/comma-dangle`)
- **Object spacing**: Always around braces (`@stylistic/object-curly-spacing`)
- **Array spacing**: Never around brackets (`@stylistic/array-bracket-spacing`)

#### TypeScript Specific
- No `require()` imports: `@typescript-eslint/no-require-imports`
- No floating promises: `@typescript-eslint/no-floating-promises`
- Proper return await: `@typescript-eslint/return-await`
- Member ordering: static fields/methods first, then instance fields, constructor, methods

### Prettier Configuration
```json
{
  "trailingComma": "all",
  "singleQuote": true,
  "bracketSpacing": true,
  "semi": true
}
```

### Naming Conventions

#### Classes and Interfaces
- **Classes**: PascalCase (`CdkApp`, `NxMonorepo`)
- **Interfaces**: PascalCase with descriptive names (`CdkAppOptions`, `CommitzentConfiguration`)
- **Type aliases**: PascalCase
- **Components**: Extend Projen `Component` class

#### Files and Directories
- **Files**: kebab-case (`cdk-app-project.ts`, `agents.ts`)
- **Directories**: kebab-case (`src/components`, `src/cdk`)
- **Test files**: `*.test.ts` suffix
- **Interface files**: Often in `interfaces/` subdirectories

#### Variables and Functions
- **Variables**: camelCase (`projectOptions`, `defaultConfig`)
- **Functions**: camelCase (`withCommonOptionsDefaults`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_PRETTIER_OPTIONS`)
- **Private fields**: camelCase with `private` modifier

### Project Structure Patterns

#### Component Architecture
```
src/
├── cdk/                    # CDK project templates
│   ├── interfaces/         # TypeScript interfaces
│   └── *.ts               # Project classes
├── components/             # Reusable components
│   ├── component-name/
│   │   ├── interfaces/     # Component interfaces
│   │   ├── index.ts       # Exports
│   │   └── component.ts   # Main implementation
├── monorepo/              # NX monorepo templates
├── common/                # Shared utilities
└── index.ts              # Main exports
```

#### Class Design Patterns
- Extend appropriate Projen base classes (`AwsCdkTypeScriptApp`, `Component`)
- Use constructor injection for dependencies
- Implement readonly properties for component references
- Use static factory methods for configuration

### Error Handling

#### Exception Patterns
- Use built-in TypeScript/Node.js error types
- Provide descriptive error messages
- Avoid silent failures
- Use proper error propagation in async code

#### Validation
- Validate inputs in constructors
- Use TypeScript's strict null checks
- Implement proper type guards when needed

### Documentation Standards

#### JSDoc Comments
```typescript
/**
 * CDK TypeScript App Project
 * 
 * @pjid cdk-app
 */
export class CdkApp extends AwsCdkTypeScriptApp {
  /**
   * Optional Commitzent component for conventional commits
   */
  readonly commitzent?: Commitzent;
}
```

#### Interface Documentation
- Document all public interfaces
- Include usage examples where helpful
- Use `@pjid` tags for project identifiers
- Document component purposes and integration points

### Testing Guidelines

#### Test Structure
- Place tests in `test/` directory
- Use `*.test.ts` naming convention
- One test file per main class/component
- Use descriptive test names

#### Jest Patterns
```typescript
describe('CdkApp', () => {
  test('should generate expected project structure', () => {
    const project = new TestProject();
    Testing.synth(project);
    // Assertions using snapshot testing
  });
});
```

#### Coverage Requirements
- Maintain high test coverage
- Test both success and error paths
- Use Projen's `Testing.synth()` for project generation tests
- Verify generated file contents with snapshots

### Dependencies Management

#### Dependency Types
- **Runtime**: Only `projen` as main dependency
- **Peer Dependencies**: `constructs`, `projen`
- **Dev Dependencies**: TypeScript toolchain, testing, linting

#### Version Constraints
- Use compatible version ranges (`^` for minor updates)
- Pin exact versions for build tools when stability is critical
- Regular dependency updates via Projen's upgrade workflow

## File Modifications

### Critical Files - Do Not Modify Directly
- `package.json` (generated by Projen)
- `.eslintrc.json` (generated by Projen)  
- `tsconfig.json` (generated by Projen)
- `tsconfig.dev.json` (generated by Projen)

### Configuration Source
- All configuration changes go in `.projenrc.ts`
- Run `npx projen` after configuration changes
- Components are configured via TypeScript classes

### When Adding Features
1. Create component in `src/components/`
2. Add interface definitions
3. Export from appropriate index files
4. Add comprehensive tests
5. Update documentation if needed
6. Run full build pipeline

## Common Patterns

### Component Integration
```typescript
// In constructor of project class
const components = CommonOptionsConfig.withCommonComponents(this, opts);
this.commitzent = components.commitzent;
```

### Configuration Merging
```typescript
const opts = CommonOptionsConfig.withCommonOptionsDefaults({
  ...options,
});
```

### Projen Task Creation
```typescript
const task = project.addTask('task-name', {
  description: 'Task description',
  steps: [{ exec: 'command', receiveArgs: false }],
});
task.lock(); // Prevent modification
```

This codebase follows strict TypeScript patterns with Projen's configuration-as-code approach. All generated files are immutable and configuration changes must go through the `.projenrc.ts` file.