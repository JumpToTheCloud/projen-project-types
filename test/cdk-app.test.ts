import { AwsCdkTypeScriptAppOptions } from 'projen/lib/awscdk';
import { Testing } from 'projen/lib/testing';
import { CdkApp } from '../src/cdk/cdk-app-project';

describe('CdkApp', () => {
  describe('Prettier Configuration', () => {
    test('should configure prettier with default options when not specified', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file exists
      expect(snapshot['.prettierrc.json']).toBeDefined();

      // Snapshot test for prettier configuration
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
    });

    test('should not override prettier when explicitly set to false', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: false,
      };

      const project = new CdkApp(options);
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

      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettierOptions: customPrettierOptions,
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file exists
      expect(snapshot['.prettierrc.json']).toBeDefined();

      // Snapshot test for custom prettier configuration
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
    });
  });

  describe('VSCode Configuration', () => {
    test('should configure VSCode settings and extensions by default', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files exist
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();

      // Snapshot tests for VSCode configuration
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
    });

    test('should configure VSCode when explicitly set to true', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        vscode: true,
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files exist
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();

      // Snapshot tests for VSCode configuration
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
    });

    test('should not configure VSCode when explicitly set to false', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        vscode: false,
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files do not exist when disabled
      expect(snapshot['.vscode/settings.json']).toBeUndefined();
      expect(snapshot['.vscode/extensions.json']).toBeUndefined();
    });
  });

  describe('Combined Configuration', () => {
    test('should handle both prettier and vscode configurations together', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: true,
        vscode: true,
      };

      const project = new CdkApp(options);
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
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: false,
        vscode: true,
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify prettier is disabled but VSCode is enabled
      expect(snapshot['.prettierrc.json']).toBeUndefined();
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();
    });
  });

  describe('App-specific Configuration', () => {
    test('should create CDK app structure with default sample code', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify CDK app specific files exist
      expect(snapshot['src/main.ts']).toBeDefined();
      expect(snapshot['cdk.json']).toBeDefined();

      // Snapshot tests for CDK app configuration
      expect(snapshot['src/main.ts']).toMatchSnapshot();
      expect(snapshot['cdk.json']).toMatchSnapshot();
    });

    test('should configure CDK app without sample code when disabled', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        sampleCode: false,
      };

      const project = new CdkApp(options);
      const snapshot = Testing.synth(project);

      // Verify main.ts is not created when sample code is disabled
      expect(snapshot['src/main.ts']).toBeUndefined();

      // But cdk.json should still exist
      expect(snapshot['cdk.json']).toBeDefined();
      expect(snapshot['cdk.json']).toMatchSnapshot();
    });
  });
});
