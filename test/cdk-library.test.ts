import { AwsCdkConstructLibraryOptions } from 'projen/lib/awscdk';
import { Testing } from 'projen/lib/testing';
import { CdkLibrary } from '../src/cdk/cdk-library-project';

describe('CdkLibrary', () => {
  describe('Prettier Configuration', () => {
    test('should configure prettier with default options when not specified', () => {
      const options: AwsCdkConstructLibraryOptions = {
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
      const options: AwsCdkConstructLibraryOptions = {
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

      const options: AwsCdkConstructLibraryOptions = {
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
      const options: AwsCdkConstructLibraryOptions = {
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
      const options: AwsCdkConstructLibraryOptions = {
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
      const options: AwsCdkConstructLibraryOptions = {
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
      const options: AwsCdkConstructLibraryOptions = {
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
      const options: AwsCdkConstructLibraryOptions = {
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
});
