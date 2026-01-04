# Default Configurations

This document describes the default configurations applied to all project types in this package.

## Prettier Configuration

All projects include Prettier with the following default settings:

### Settings Applied

```json title=".prettierrc.json" linenums="1"
{
  "trailingComma": "es5",
  "singleQuote": true,
  "bracketSpacing": true,
  "semi": true
}
```

### Rationale

- **`trailingComma: "es5"`**: Ensures consistent trailing commas in objects and arrays, making diffs cleaner
- **`singleQuote: true`**: Uses single quotes for strings, which is common in JavaScript/TypeScript projects
- **`bracketSpacing: true`**: Adds spaces inside object literal braces `{ foo: bar }`
- **`semi: true`**: Always includes semicolons for statement termination

### Customization

You can override these settings by providing custom `prettierOptions`:

```typescript title="Custom Prettier Configuration" linenums="1" hl_lines="5 6 7 8"
const project = new ProjectType({
  // ... other options
  prettierOptions: {
    settings: {
      singleQuote: false,
      semi: false,
      tabWidth: 4,
      printWidth: 120,
    },
  },
});
```

**Highlighted lines explanation:**

- **Line 5**: Use double quotes instead of single quotes
- **Line 6**: Omit semicolons for cleaner code
- **Line 7**: Use 4 spaces for indentation instead of 2
- **Line 8**: Allow longer line length

### Disabling Prettier

To completely disable Prettier:

```typescript title="Disable Prettier" linenums="1" hl_lines="3"
const project = new ProjectType({
  // ... other options
  prettier: false,
});
```

**Highlighted line explanation:**

- **Line 3**: No `.prettierrc.json` file will be created

## VSCode Configuration

All projects include VSCode workspace configuration when enabled (default behavior).

### Settings Applied

```json title=".vscode/settings.json" linenums="1"
{
  "editor.formatOnSave": true,
  "editor.indentSize": 2, 
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.nodePath": "./node_modules",
  "eslint.useFlatConfig": false
}
```

### Recommended Extensions

The following extensions are automatically recommended for all projects:

```json title=".vscode/extensions.json" linenums="1"
{
  "recommendations": [
    "amazonwebservices.aws-toolkit-vscode",
    "DanielThielking.aws-cloudformation-yaml", 
    "ms-azuretools.vscode-containers",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "mhutchie.git-graph",
    "github.vscode-github-actions",
    "GitHub.vscode-pull-request-github",
    "eamodio.gitlens",
    "spmeesseman.vscode-taskexplorer",
    "wayou.vscode-todo-highlight",
    "vscode-icons-team.vscode-icons",
    "ms-vscode-remote.vscode-remote-extensionpack"
  ]
}
```

#### Development Tools
- **AWS Toolkit for VS Code** (`amazonwebservices.aws-toolkit-vscode`)
- **CloudFormation YAML** (`DanielThielking.aws-cloudformation-yaml`)
- **Docker** (`ms-azuretools.vscode-containers`)

#### Code Quality & Formatting
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

#### Git & Version Control
- **Git Graph** (`mhutchie.git-graph`)
- **GitHub Actions** (`github.vscode-github-actions`)
- **GitHub Pull Requests** (`GitHub.vscode-pull-request-github`)
- **GitLens** (`eamodio.gitlens`)

#### Productivity
- **Task Explorer** (`spmeesseman.vscode-taskexplorer`)
- **TODO Highlight** (`wayou.vscode-todo-highlight`)
- **VSCode Icons** (`vscode-icons-team.vscode-icons`)
- **Remote Development Extension Pack** (`ms-vscode-remote.vscode-remote-extensionpack`)

### Rationale

- **Format on save**: Automatically formats code when saving, ensuring consistency
- **Prettier as default formatter**: Uses the configured prettier settings
- **ESLint integration**: Provides real-time linting and error detection
- **AWS-focused extensions**: Optimized for AWS and cloud development workflows
- **Git workflow tools**: Enhanced git management and collaboration features

### Customization

You can disable VSCode configuration entirely:

```typescript
const project = new ProjectType({
  // ... other options
  vscode: false,
});
```

Currently, there's no built-in way to customize individual VSCode settings or extensions, but this may be added in future versions.

## Configuration Behavior

### Default Behavior (Recommended)

When no explicit configuration is provided:

```typescript title="Default Configuration" linenums="1"
const project = new ProjectType({
  name: 'my-project',
  // ... other required options
  // prettier: undefined (defaults to true)
  // vscode: undefined (defaults to true)
});
```

**Result**: Both Prettier and VSCode configurations are applied with default settings.

### Mixed Configurations

You can mix and match configurations:

=== "Prettier Only"

    ```typescript linenums="1" title="Prettier Only Configuration" hl_lines="3 4"
    const project = new ProjectType({
      // ... other options
      prettier: true,
      vscode: false,
    });
    ```

    **Highlighted lines explanation:**
    
    - **Line 3**: Enable prettier with default settings
    - **Line 4**: No VSCode configuration files created

=== "VSCode Only"

    ```typescript linenums="1" title="VSCode Only Configuration" hl_lines="3 4"
    const project = new ProjectType({
      // ... other options 
      prettier: false,
      vscode: true,
    });
    ```

    **Highlighted lines explanation:**
    
    - **Line 3**: No prettier configuration files created
    - **Line 4**: Enable VSCode with default settings

=== "Both Disabled"

    ```typescript linenums="1" title="Minimal Configuration" hl_lines="3 4"
    const project = new ProjectType({
      // ... other options
      prettier: false,
      vscode: false,
    });
    ```

    **Highlighted lines explanation:**
    
    - **Line 3**: No prettier files
    - **Line 4**: No VSCode files

## Files Created

### When Prettier is Enabled

- `.prettierrc.json` - Prettier configuration file
- `.prettierignore` - Files to ignore during formatting (if applicable)

### When VSCode is Enabled

- `.vscode/settings.json` - Workspace settings
- `.vscode/extensions.json` - Recommended extensions

## Best Practices

### 1. Stick with Defaults

The default configurations have been carefully chosen for optimal development experience across teams. Unless you have specific requirements, it's recommended to use the defaults.

### 2. Team Consistency

If you customize configurations, ensure all team members are aware of the changes and update their local environments accordingly.

### 3. Document Customizations

If you deviate from defaults, document the reasons in your project's README or contributing guidelines.

### 4. Extension Installation

Encourage team members to install the recommended VSCode extensions for the best development experience.

## Future Enhancements

Planned improvements to the default configurations:

- **ESLint default configuration**: Common ESLint rules for TypeScript projects
- **Jest configuration**: Default test setup and configuration
- **GitHub Actions**: Standard CI/CD workflows
- **Dependabot**: Automated dependency updates
- **Customizable VSCode settings**: Allow overriding individual settings and extensions

## Contributing

To propose changes to the default configurations:

1. Open an issue describing the proposed change and rationale
2. Discuss with maintainers and community
3. Submit a pull request with the changes
4. Update documentation and tests
5. Ensure backward compatibility

---

*These configurations are maintained by [Jump to the Cloud](https://jumptothecloud.tech) and are designed to provide productive development environments out of the box.*