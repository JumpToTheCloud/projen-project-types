# Commitzent Component

The Commitzent Component provides standardized **Conventional Commits** support to all project types, enabling consistent and structured commit messages across your development workflow.

## Overview

[Conventional Commits](https://www.conventionalcommits.org/) is a specification for adding human and machine-readable meaning to commit messages. The Commitzent component integrates [Commitizen](https://commitizen.github.io/cz-cli/) with a customizable configuration to enforce this standard in your projects.

Key benefits:
- **Consistent commit format** across team members
- **Automated changelog generation** support
- **Semantic versioning** integration
- **Interactive prompts** to guide commit creation
- **Customizable scopes** for different project areas

!!! info "Universal Integration"
    This component is automatically included in **all** project types (CDK App, CDK Library, CDK8s App, CDK8s Library) by default and can be easily disabled if not needed.

## Key Features

### 🔧 **Automatic Setup**
- Installs Commitizen and cz-customizable dependencies
- Generates `.czrc` configuration file
- Creates customizable `.cz-config.js` with project-specific settings
- Adds `commit` script to package.json

### 📝 **Interactive Commit Workflow**
- Guided prompts for commit type, scope, and description
- Built-in validation for conventional commit format
- Support for breaking changes and issue references
- Consistent formatting across all commits

### 🎯 **Customizable Scopes**
- Pre-configured default scopes for each project type
- Ability to add custom scopes programmatically
- Project-specific scope suggestions

### ⚡ **Easy Usage**
- Simple `yarn commit` command replaces `git commit`
- No need to remember conventional commit syntax
- Automatic formatting and validation

## Default Configuration

### Commit Types
The component includes standard conventional commit types:

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(api): add user authentication` |
| `fix` | Bug fix | `fix(ui): resolve navigation issue` |
| `docs` | Documentation | `docs(readme): update installation guide` |
| `style` | Code style changes | `style(components): format with prettier` |
| `refactor` | Code refactoring | `refactor(utils): simplify helper functions` |
| `perf` | Performance improvements | `perf(api): optimize database queries` |
| `test` | Tests | `test(auth): add unit tests for login` |
| `build` | Build system | `build(webpack): update configuration` |
| `ci` | CI/CD changes | `ci(github): add automated testing` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `revert` | Revert previous commit | `revert: undo previous feature` |

### Default Scopes
Each project type includes relevant default scopes:

=== "CDK App"
    - `stack` - CloudFormation stacks
    - `construct` - CDK constructs
    - `config` - Configuration changes
    - `infra` - Infrastructure components

=== "CDK Library"
    - `construct` - Library constructs
    - `api` - Public API changes
    - `examples` - Usage examples
    - `config` - Configuration

=== "CDK8s Projects"
    - `manifest` - Kubernetes manifests
    - `chart` - Helm charts
    - `config` - Configuration
    - `docs` - Documentation

## Usage

### Basic Commit Workflow

Instead of using `git commit`, use the interactive commit command:

```bash
# Stage your changes
git add .

# Use interactive commit
yarn commit
```

### Interactive Prompt Example

```bash
$ yarn commit

? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests

? What is the scope of this change (e.g. component or file name): (press enter to skip)
 api

? Write a short, imperative tense description of the change (max 72 chars):
 add user authentication endpoint

? Provide a longer description of the change: (press enter to skip)
 Implement JWT-based authentication with login and logout endpoints

? Are there any breaking changes? (y/N)

? Does this change affect any open issues? (y/N)
```

**Result:** `feat(api): add user authentication endpoint`

## Customization

### Adding Custom Scopes

You can add project-specific scopes programmatically:

```typescript title=".projenrc.ts" hl_lines="12-14"
import { CdkApp } from '@jttc/projen-project-types';

const project = new CdkApp({
  name: 'my-cdk-app',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
});

// Add custom scopes for your project
project.commitzent?.addScope({ name: 'database' });
project.commitzent?.addScope({ name: 'auth' });
project.commitzent?.addScope({ name: 'ui' });

project.synth();
```

### Disabling Commitzent

If you prefer not to use conventional commits, you can disable the component:

```typescript title=".projenrc.ts" hl_lines="6"
import { CdkLibrary } from '@jttc/projen-project-types';

const project = new CdkLibrary({
  name: 'my-library',
  // ... other options
  commitzent: false, // Disable conventional commits
});

project.synth();
```

When disabled:
- ❌ No Commitizen dependencies are installed
- ❌ No `.czrc` or `.cz-config.js` files are generated
- ❌ No `commit` script in package.json
- ✅ Regular `git commit` workflow is preserved

## Generated Files

### `.czrc`
```json
{
  "path": "./node_modules/cz-customizable"
}
```

### `.cz-config.js` (example for CDK App)
```javascript
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    // ... more types
  ],
  scopes: [
    { name: 'stack' },
    { name: 'construct' },
    { name: 'config' },
    { name: 'infra' },
    // ... custom scopes
  ],
  messages: {
    type: "Select the type of change that you're committing:",
    scope: 'What is the scope of this change (e.g. component or file name):',
    customScope: 'Denote the SCOPE of this change:',
    subject: 'Write a short, imperative tense description of the change (max 72 chars):\n',
    body: 'Provide a longer description of the change: (press enter to skip)\n',
    breaking: 'Are there any breaking changes? (y/N)',
    footer: 'Does this change affect any open issues? (y/N)',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: [],
  subjectLimit: 72,
};
```

## Package.json Integration

The component automatically adds the commit script to your package.json:

```json title="package.json"
{
  "scripts": {
    "commit": "npx projen commit"
  },
  "devDependencies": {
    "commitizen": "latest",
    "cz-customizable": "latest"
  }
}
```

## Best Practices

### Commit Message Guidelines

1. **Use imperative mood**: "add feature" not "added feature"
2. **Keep subject line under 72 characters**
3. **Provide context in scope**: use meaningful scope names
4. **Include issue numbers** when applicable
5. **Mark breaking changes** clearly

### Scope Naming

- Use **lowercase** scope names
- Keep scopes **short and descriptive**
- Group related changes under **consistent scopes**
- Avoid **too many scopes** - keep it simple

### Example Good Commits

```bash
feat(auth): implement JWT token validation
fix(api): handle null response in user endpoint
docs(readme): add deployment instructions
style(components): apply consistent formatting
refactor(utils): extract common helper functions
test(auth): add integration tests for login flow
```


## Related Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitizen CLI Documentation](https://commitizen.github.io/cz-cli/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)