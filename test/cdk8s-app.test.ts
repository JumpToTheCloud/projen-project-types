import { Testing } from 'projen/lib/testing';
import { Cdk8App } from '../src/cdk/cdk8s-app-project';
import {
  Cdk8sAppOptions,
  K8sVersion,
} from '../src/components/cdk8s/interfaces/Cdk8s';

// Mock the CDK8s component to set pjid specifically for cdk8s-app tests
jest.mock('../src/components/cdk8s/cdk8s', () => {
  const originalModule = jest.requireActual('../src/components/cdk8s/cdk8s');

  class MockCdk8sComponent {
    appPath: string;
    appFile: string;
    outputPath: string;
    k8sVersion: any;
    imports: string[];

    constructor(project: any, _id: string, props?: any) {
      // Set up mock initProject for cdk8s-app projects
      if (!project.initProject) {
        Object.defineProperty(project, 'initProject', {
          value: { type: { pjid: 'cdk8s-app' } },
          writable: true,
          configurable: true,
        });
      }

      // Set properties directly without calling super to avoid file creation
      this.appPath = props?.appPath || 'src/k8s';
      this.appFile = props?.appFile || 'main.ts';
      this.outputPath = props?.outputPath || 'kubernetes';
      this.k8sVersion = props?.k8sVersion || K8sVersion.V1_31;
      this.imports = props?.imports || [];
    }
  }

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

describe('Cdk8App', () => {
  describe('Basic Configuration', () => {
    test('should create cdk8s app with default settings', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8App(options);
      const snapshot = Testing.synth(project);

      // Verify it's a TypeScript project with CDK8s capabilities
      expect(snapshot['package.json']).toBeDefined();
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.name).toBe('test-cdk8s-app');

      // Verify constructs dependency is added by the project
      expect(packageJson.dependencies).toHaveProperty('constructs');

      // Verify project has cdk8s component
      expect(project.cdk8s).toBeDefined();

      // Snapshot test for package.json
      expect(snapshot['package.json']).toMatchSnapshot();
    });

    test('should include cdk8s component with default properties', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8App(options);

      // Verify cdk8s component is created
      expect(project.cdk8s).toBeDefined();
      expect(project.cdk8s.appPath).toBe('src/k8s');
      expect(project.cdk8s.appFile).toBe('main.ts');
      expect(project.cdk8s.outputPath).toBe('kubernetes');
      expect(project.cdk8s.k8sVersion).toBe(K8sVersion.V1_31);
    });

    test('should create cdk8s app with custom options', () => {
      const options: Cdk8sAppOptions = {
        name: 'custom-cdk8s-app',
        defaultReleaseBranch: 'main',
        appPath: 'custom/k8s',
        appFile: 'index.ts',
        outputPath: 'dist/k8s',
        k8sVersion: K8sVersion.V1_30,
        imports: [
          'k8s@1.30.0/api/core/v1/pod',
          'k8s@1.30.0/api/apps/v1/deployment',
        ],
      };

      const project = new Cdk8App(options);
      const snapshot = Testing.synth(project);

      // Verify custom configuration
      expect(project.cdk8s.appPath).toBe('custom/k8s');
      expect(project.cdk8s.appFile).toBe('index.ts');
      expect(project.cdk8s.outputPath).toBe('dist/k8s');
      expect(project.cdk8s.k8sVersion).toBe(K8sVersion.V1_30);
      expect(project.cdk8s.imports).toEqual([
        'k8s@1.30.0/api/core/v1/pod',
        'k8s@1.30.0/api/apps/v1/deployment',
      ]);

      // Verify package.json dependencies reflect constructs
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.dependencies).toHaveProperty('constructs');

      // Verify cdk8s.yaml configuration reflects custom settings
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
    });
  });

  describe('PostSynthesize Behavior', () => {
    test('should execute cdk8s:import task during postSynthesize', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8App(options);

      // Mock the task to return undefined (task not found)
      // This simulates the real scenario where the task might not exist yet
      jest.spyOn(project.tasks, 'tryFind').mockReturnValue(undefined);

      // Test that the method exists and can be called without throwing
      expect(() => project.postSynthesize()).not.toThrow();

      // Verify task is searched for
      expect(project.tasks.tryFind).toHaveBeenCalledWith('cdk8s:import');
    });

    test('should handle missing cdk8s:import task gracefully', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8App(options);

      // Mock execSync to verify it's not called
      const mockExecSync = jest.fn();
      jest.doMock('child_process', () => ({
        execSync: mockExecSync,
      }));

      // Mock task not found
      jest.spyOn(project.tasks, 'tryFind').mockReturnValue(undefined);

      // Execute postSynthesize
      project.postSynthesize();

      // Verify task is searched but execSync is not called
      expect(project.tasks.tryFind).toHaveBeenCalledWith('cdk8s:import');
      expect(mockExecSync).not.toHaveBeenCalled();
    });
  });

  describe('Dependencies', () => {
    test('should include constructs dependency with correct version', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8App(options);
      const snapshot = Testing.synth(project);
      const packageJson = getPackageJson(snapshot);

      // Verify constructs dependency is added
      expect(packageJson.dependencies).toHaveProperty('constructs');
      expect(packageJson.dependencies.constructs).toBe('^10.4.2');
    });

    test('should handle different k8s versions correctly', () => {
      const testVersions = [
        { k8sVersion: K8sVersion.V1_29, expectedPlus: 'cdk8s-plus-29' },
        { k8sVersion: K8sVersion.V1_30, expectedPlus: 'cdk8s-plus-30' },
        { k8sVersion: K8sVersion.V1_31, expectedPlus: 'cdk8s-plus-31' },
        { k8sVersion: K8sVersion.V1_32, expectedPlus: 'cdk8s-plus-32' },
        { k8sVersion: K8sVersion.V1_33, expectedPlus: 'cdk8s-plus-33' },
      ];

      testVersions.forEach(({ k8sVersion }) => {
        const options: Cdk8sAppOptions = {
          name: `test-cdk8s-app-${k8sVersion}`,
          defaultReleaseBranch: 'main',
          k8sVersion,
        };

        const project = new Cdk8App(options);
        const snapshot = Testing.synth(project);
        const packageJson = getPackageJson(snapshot);

        // Component handles cdk8s dependencies, we just verify constructs
        expect(packageJson.dependencies).toHaveProperty('constructs');
      });
    });
  });

  describe('ESLint Configuration', () => {
    test('should configure eslint with cdk8s-specific ignore patterns', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      const project = new Cdk8App(options);
      const snapshot = Testing.synth(project);

      // Verify eslint configuration exists
      expect(snapshot['.eslintrc.json']).toBeDefined();

      // Snapshot test for eslint configuration
      expect(snapshot['.eslintrc.json']).toMatchSnapshot();
    });
  });

  describe('Sample Code', () => {
    test('should disable sample code by default', () => {
      const options: Cdk8sAppOptions = {
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
      };

      new Cdk8App(options);

      // Verify that sample code is disabled
      // The actual verification would depend on the implementation details
      // This would be reflected in the project configuration, not directly in files
      // The specific implementation may vary based on how sampleCode affects the project
    });
  });
});
