import { Testing } from 'projen/lib/testing';
import { CdkLibrary } from '../src/cdk/cdk-library-project';
import { CdkLibraryOptions } from '../src/cdk/interfaces';

// Helper function to parse package.json from snapshot
function getPackageJson(snapshot: Record<string, any>): any {
  const packageJsonContent = snapshot['package.json'];
  return typeof packageJsonContent === 'string'
    ? JSON.parse(packageJsonContent)
    : packageJsonContent;
}

describe('CdkLibrary', () => {
  describe('Prettier Configuration', () => {
    test('should configure prettier with default options when not specified', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file exists
      expect(snapshot['.prettierrc.json']).toBeDefined();

      // Snapshot test for prettier configuration
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
    });

    test('should not override prettier when explicitly set to false', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: false,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file does not exist when disabled
      expect(snapshot['.prettierrc.json']).toBeUndefined();
    });

    test('should preserve custom prettier options when provided', () => {
      const customPrettierOptions = {
        settings: {
          singleQuote: false,
          semi: false,
          tabWidth: 4,
        },
      };

      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettierOptions: customPrettierOptions,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file exists
      expect(snapshot['.prettierrc.json']).toBeDefined();

      // Snapshot test for custom prettier configuration
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
    });
  });

  describe('VSCode Configuration', () => {
    test('should configure VSCode settings and extensions by default', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files exist
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();

      // Snapshot tests for VSCode configuration
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
    });

    test('should configure VSCode when explicitly set to true', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        vscode: true,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files exist
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();

      // Snapshot tests for VSCode configuration
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
    });

    test('should not configure VSCode when explicitly set to false', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        vscode: false,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files do not exist when disabled
      expect(snapshot['.vscode/settings.json']).toBeUndefined();
      expect(snapshot['.vscode/extensions.json']).toBeUndefined();
    });
  });

  describe('Combined Configuration', () => {
    test('should handle both prettier and vscode configurations together', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: true,
        vscode: true,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify both prettier and VSCode files exist
      expect(snapshot['.prettierrc.json']).toBeDefined();
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();

      // Test that they work together properly
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
    });

    test('should handle disabled prettier with enabled vscode', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: false,
        vscode: true,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier is disabled but VSCode is enabled
      expect(snapshot['.prettierrc.json']).toBeUndefined();
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();
    });
  });

  describe('Commitzent Configuration', () => {
    test('should include commitzent dependencies by default', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify package.json exists and contains commitzent dependencies
      expect(snapshot['package.json']).toBeDefined();
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.devDependencies).toHaveProperty('commitizen');
      expect(packageJson.devDependencies).toHaveProperty('cz-customizable');

      // Verify commitzent configuration files exist
      expect(snapshot['.czrc']).toBeDefined();
      expect(snapshot['.cz-config.js']).toBeDefined();

      // Snapshot tests for commitzent configuration
      expect(snapshot['package.json']).toMatchSnapshot();
      expect(snapshot['.czrc']).toMatchSnapshot();
      expect(snapshot['.cz-config.js']).toMatchSnapshot();
    });

    test('should allow adding custom scopes to commitzent', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkLibrary(options);

      // Add custom scope
      project.commitzent?.addScope({ name: 'test' });

      const snapshot = Testing.synth(project);

      // Verify .cz-config.js contains the custom scope
      expect(snapshot['.cz-config.js']).toBeDefined();
      const czConfig = snapshot['.cz-config.js'];
      expect(czConfig).toContain("name: 'test'");

      // Snapshot test to verify custom scope is included
      expect(snapshot['.cz-config.js']).toMatchSnapshot();
    });

    test('should not include commitzent when disabled', () => {
      const options: CdkLibraryOptions = {
        name: 'test-cdk-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        commitzent: false,
      };

      const project = new CdkLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify commitzent is not available
      expect(project.commitzent).toBeUndefined();

      // Verify commitzent dependencies are not in package.json
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.devDependencies).not.toHaveProperty('commitizen');
      expect(packageJson.devDependencies).not.toHaveProperty('cz-customizable');

      // Verify commitzent configuration files don't exist
      expect(snapshot['.czrc']).toBeUndefined();
      expect(snapshot['.cz-config.js']).toBeUndefined();

      // Snapshot test to verify package.json doesn't contain commitzent dependencies
      expect(snapshot['package.json']).toMatchSnapshot();
    });
  });
});
