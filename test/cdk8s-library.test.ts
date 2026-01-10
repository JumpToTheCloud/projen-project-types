import { Testing } from 'projen/lib/testing';
import { Cdk8sLibrary } from '../src/cdk/cdk8s-library-project';
import { Cdk8sLibraryOptions } from '../src/cdk/interfaces';
import { K8sVersion } from '../src/components/cdk8s/interfaces/Cdk8s';

// Mock the CDK8s component to set pjid specifically for cdk8s-library tests
jest.mock('../src/components/cdk8s/cdk8s', () => {
  const originalModule = jest.requireActual('../src/components/cdk8s/cdk8s');

  class MockCdk8sComponent extends originalModule.Cdk8sComponent {
    constructor(project: any, id: string, props?: any) {
      // Set up mock initProject for cdk8s-library projects
      if (!project.initProject) {
        Object.defineProperty(project, 'initProject', {
          value: { type: { pjid: 'cdk8s-library' } },
          writable: true,
          configurable: true,
        });
      }

      super(project, id, props);
    }
  }

  return {
    ...originalModule,
    Cdk8sComponent: MockCdk8sComponent,
  };

  return {
    ...originalModule,
    Cdk8sComponent: MockCdk8sComponent,
  };
});

// Helper function to parse package.json from snapshot
function getPackageJson(snapshot: Record<string, any>): any {
  const packageJsonContent = snapshot['package.json'];
  return typeof packageJsonContent === 'string'
    ? JSON.parse(packageJsonContent)
    : packageJsonContent;
}

describe('Cdk8sLibrary', () => {
  describe('Basic Configuration', () => {
    test('should create cdk8s library with default settings', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify it's a CDK construct library
      expect(snapshot['package.json']).toBeDefined();
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.name).toBe('test-cdk8s-library');
      expect(packageJson.peerDependencies).toHaveProperty('constructs');

      // Verify cdk8s-specific dependencies
      expect(packageJson.dependencies).toHaveProperty('cdk8s');
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-30'); // Default k8s version 1.30
      expect(packageJson.dependencies).toHaveProperty('constructs');
      expect(packageJson.devDependencies).toHaveProperty('cdk8s-cli');

      // Verify cdk8s configuration file exists
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();

      // Verify cdk8s tasks are created (but NOT cdk8s:synth for libraries)
      expect(packageJson.scripts).toHaveProperty('cdk8s');
      expect(packageJson.scripts).toHaveProperty('cdk8s:import');
      expect(packageJson.scripts).not.toHaveProperty('cdk8s:synth'); // Should NOT exist for cdk8s-library

      // Verify main.ts sample file exists in default location
      expect(snapshot['src/main.ts']).toBeDefined();
      expect(snapshot['src/main.ts']).toMatchSnapshot();

      // Snapshot test for package.json
      expect(snapshot['package.json']).toMatchSnapshot();
    });

    test('should include cdk8s component with default properties', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);

      // Verify cdk8s component is attached
      expect(project.cdk8s).toBeDefined();
      expect(project.cdk8s.appPath).toBe('src');
      expect(project.cdk8s.appFile).toBe('main.ts');
      expect(project.cdk8s.outputPath).toBe('kubernetes');
      expect(project.cdk8s.k8sVersion).toBe(K8sVersion.V1_30);
    });

    test('should not include cdk8s:synth task for cdk8s-library projects', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);
      const packageJson = getPackageJson(snapshot);

      // Verify that cdk8s:synth task is NOT created for libraries
      expect(packageJson.scripts).toHaveProperty('cdk8s');
      expect(packageJson.scripts).toHaveProperty('cdk8s:import');
      expect(packageJson.scripts).not.toHaveProperty('cdk8s:synth');
    });

    test('should use main-library.ts.template for cdk8s-library projects', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify main.ts exists
      expect(snapshot['src/main.ts']).toBeDefined();

      // The main.ts content should NOT contain app instantiation and synth
      // (library template only exports the Chart class)
      const mainContent = snapshot['src/main.ts'] as string;
      expect(mainContent).not.toMatch(/const app = new App/);
      expect(mainContent).not.toMatch(/app\.synth/);
      expect(mainContent).toMatch(/export class MyChart/);

      // Snapshot test for main.ts content
      expect(snapshot['src/main.ts']).toMatchSnapshot();
    });

    test('should create test file for cdk8s-library projects', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify test file exists for cdk8s-library
      expect(snapshot['test/main.test.ts']).toBeDefined();
      expect(snapshot['test/main.test.ts']).toMatchSnapshot();
    });
  });

  describe('Cdk8s Configuration Options', () => {
    test('should configure custom cdk8s options', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        appPath: 'src/k8s',
        appFile: 'app.ts',
        outputPath: 'manifests',
        k8sVersion: K8sVersion.V1_31,
        imports: ['custom-resource@1.0.0'],
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify custom cdk8s configuration
      expect(project.cdk8s.appPath).toBe('src/k8s');
      expect(project.cdk8s.appFile).toBe('app.ts');
      expect(project.cdk8s.outputPath).toBe('manifests');
      expect(project.cdk8s.k8sVersion).toBe(K8sVersion.V1_31);
      expect(project.cdk8s.imports).toContain('custom-resource@1.0.0');

      // Verify package.json reflects the custom k8s version
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-31');
      expect(packageJson.dependencies).not.toHaveProperty('cdk8s-plus-30');

      // Verify custom sample file location
      expect(snapshot['src/k8s/app.ts']).toBeDefined();
      expect(snapshot['src/k8s/app.ts']).toMatchSnapshot();

      // Verify cdk8s.yaml configuration reflects custom settings
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
    });

    test('should handle different k8s versions', () => {
      const testCases = [
        { version: K8sVersion.V1_29, expectedPlus: 'cdk8s-plus-29' },
        { version: K8sVersion.V1_30, expectedPlus: 'cdk8s-plus-30' },
        { version: K8sVersion.V1_31, expectedPlus: 'cdk8s-plus-31' },
        { version: K8sVersion.V1_32, expectedPlus: 'cdk8s-plus-32' },
        { version: K8sVersion.V1_33, expectedPlus: 'cdk8s-plus-33' },
      ];

      testCases.forEach(({ version, expectedPlus }) => {
        const options: Cdk8sLibraryOptions = {
          name: 'test-cdk8s-library',
          author: 'test-author',
          authorAddress: 'test@example.com',
          repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
          cdkVersion: '2.1.0',
          defaultReleaseBranch: 'main',
          k8sVersion: version,
        };

        const project = new Cdk8sLibrary(options);
        const snapshot = Testing.synth(project);
        const packageJson = getPackageJson(snapshot);

        expect(packageJson.dependencies).toHaveProperty(expectedPlus);
        expect(project.cdk8s.k8sVersion).toBe(version);
      });
    });
  });

  describe('Prettier Configuration', () => {
    test('should configure prettier with default options when not specified', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file exists
      expect(snapshot['.prettierrc.json']).toBeDefined();
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
    });

    test('should not override prettier when explicitly set to false', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: false,
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file does not exist when disabled
      expect(snapshot['.prettierrc.json']).toBeUndefined();
    });
  });

  describe('VSCode Configuration', () => {
    test('should configure VSCode settings and extensions by default', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files exist
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();

      // Snapshot tests for VSCode configuration
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
    });

    test('should not configure VSCode when explicitly set to false', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        vscode: false,
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify VSCode configuration files do not exist when disabled
      expect(snapshot['.vscode/settings.json']).toBeUndefined();
      expect(snapshot['.vscode/extensions.json']).toBeUndefined();
    });
  });

  describe('Combined Configuration', () => {
    test('should handle cdk8s options with prettier and vscode configurations together', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'test-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        prettier: true,
        vscode: true,
        appPath: 'src/k8s',
        k8sVersion: K8sVersion.V1_31,
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify all configurations exist
      expect(snapshot['.prettierrc.json']).toBeDefined();
      expect(snapshot['.vscode/settings.json']).toBeDefined();
      expect(snapshot['.vscode/extensions.json']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['src/k8s/main.ts']).toBeDefined();

      // Verify cdk8s configuration is correctly applied
      expect(project.cdk8s.appPath).toBe('src/k8s');
      expect(project.cdk8s.k8sVersion).toBe(K8sVersion.V1_31);

      // Test that they work together properly
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
      expect(snapshot['.vscode/settings.json']).toMatchSnapshot();
      expect(snapshot['.vscode/extensions.json']).toMatchSnapshot();
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
    });

    test('should handle minimal configuration with just required fields', () => {
      const options: Cdk8sLibraryOptions = {
        name: 'minimal-cdk8s-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/minimal-cdk8s-library.git',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8sLibrary(options);
      const snapshot = Testing.synth(project);

      // Should still create all necessary files with defaults
      expect(snapshot['package.json']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['src/main.ts']).toBeDefined();

      const packageJson = getPackageJson(snapshot);
      expect(packageJson.name).toBe('minimal-cdk8s-library');
      expect(packageJson.dependencies).toHaveProperty('cdk8s');
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-30');
    });
  });
});
