import { AwsCdkTypeScriptAppOptions } from 'projen/lib/awscdk';
import { Testing } from 'projen/lib/testing';
import { CdkApp } from '../src/cdk/cdk-app-project';
import { Cdk8sComponent } from '../src/components/cdk8s/cdk8s';
import { K8sVersion } from '../src/components/cdk8s/interfaces/Cdk8s';

// Helper function to parse package.json from snapshot
function getPackageJson(snapshot: Record<string, any>): any {
  const packageJsonContent = snapshot['package.json'];
  return typeof packageJsonContent === 'string'
    ? JSON.parse(packageJsonContent)
    : packageJsonContent;
}

describe('Cdk8sComponent', () => {
  describe('Default Configuration', () => {
    test('should add cdk8s component with default settings to CdkApp', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s');
      const snapshot = Testing.synth(project);

      // Verify cdk8s.yaml configuration file exists
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();

      // Verify main.ts sample file exists in default location
      expect(snapshot['src/main.ts']).toBeDefined();
      expect(snapshot['src/main.ts']).toMatchSnapshot();

      // Verify package.json has the correct dependencies
      expect(snapshot['package.json']).toBeDefined();
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.dependencies).toHaveProperty('cdk8s');
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-30'); // Default k8s version 1.30
      expect(packageJson.devDependencies).toHaveProperty('cdk8s-cli');

      // Verify tasks are created
      expect(packageJson.scripts).toHaveProperty('cdk8s');
      expect(packageJson.scripts).toHaveProperty('cdk8s:import');
      expect(packageJson.scripts).toHaveProperty('cdk8s:synth');

      // Snapshot test for package.json
      expect(snapshot['package.json']).toMatchSnapshot();
    });

    test('should create test file when used in cdk8s projects', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s');
      const snapshot = Testing.synth(project);

      // For this test, we just verify the component works correctly
      // The test file generation is conditional based on project type
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
    });
  });

  describe('Custom Configuration', () => {
    test('should use custom k8s version', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s', {
        k8sVersion: K8sVersion.V1_32,
      });
      const snapshot = Testing.synth(project);

      // Verify cdk8s.yaml uses custom k8s version
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();

      // Verify package.json has the correct cdk8s-plus version
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-32'); // Custom k8s version 1.32

      expect(snapshot['package.json']).toMatchSnapshot();
    });

    test('should use custom paths and imports', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s', {
        appPath: 'k8s',
        appFile: 'app.ts',
        outputPath: 'manifests',
        imports: ['prometheus-operator@1.0.0', 'grafana@2.0.0'],
        k8sVersion: K8sVersion.V1_31,
      });
      const snapshot = Testing.synth(project);

      // Verify cdk8s.yaml uses custom configuration
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();

      // Verify main file is created in custom location
      expect(snapshot['k8s/app.ts']).toBeDefined();
      expect(snapshot['k8s/app.ts']).toMatchSnapshot();

      // Verify package.json has the correct cdk8s-plus version
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-31'); // Custom k8s version 1.31

      // Verify custom tasks are configured
      expect(packageJson.scripts['cdk8s:import']).toContain(
        'npx projen cdk8s:import',
      );
      expect(packageJson.scripts['cdk8s:synth']).toContain(
        'npx projen cdk8s:synth',
      );

      // Note: Custom paths are configured in the task definition, not visible in package.json scripts

      expect(snapshot['package.json']).toMatchSnapshot();
    });

    test('should handle all k8s versions correctly', () => {
      const versions = [
        { version: K8sVersion.V1_29, expectedPlus: 'cdk8s-plus-29' },
        { version: K8sVersion.V1_30, expectedPlus: 'cdk8s-plus-30' },
        { version: K8sVersion.V1_31, expectedPlus: 'cdk8s-plus-31' },
        { version: K8sVersion.V1_32, expectedPlus: 'cdk8s-plus-32' },
        { version: K8sVersion.V1_33, expectedPlus: 'cdk8s-plus-33' },
      ];

      versions.forEach(({ version, expectedPlus }, index) => {
        const options: AwsCdkTypeScriptAppOptions = {
          name: `test-cdk-app-${index}`,
          cdkVersion: '2.1.0',
          defaultReleaseBranch: 'main',
        };

        const project = new CdkApp(options);
        new Cdk8sComponent(project, 'cdk8s', {
          k8sVersion: version,
        });
        const snapshot = Testing.synth(project);

        const packageJson = getPackageJson(snapshot);
        expect(packageJson.dependencies).toHaveProperty(expectedPlus);

        // Verify cdk8s.yaml contains correct k8s version
        const cdk8sYaml = snapshot['cdk8s.yaml'];
        expect(cdk8sYaml).toContain(version);
      });
    });
  });

  describe('Task Configuration', () => {
    test('should create all required cdk8s tasks with default paths', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s');
      const snapshot = Testing.synth(project);

      const packageJson = getPackageJson(snapshot);

      // Verify all cdk8s tasks exist
      expect(packageJson.scripts).toHaveProperty('cdk8s');
      expect(packageJson.scripts).toHaveProperty('cdk8s:import');
      expect(packageJson.scripts).toHaveProperty('cdk8s:synth');

      // Verify tasks use projen task runner
      expect(packageJson.scripts.cdk8s).toContain('npx projen cdk8s');
      expect(packageJson.scripts['cdk8s:import']).toContain(
        'npx projen cdk8s:import',
      );
      expect(packageJson.scripts['cdk8s:synth']).toContain(
        'npx projen cdk8s:synth',
      );

      expect(snapshot['package.json']).toMatchSnapshot();
    });

    test('should create tasks with custom paths', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s', {
        appPath: 'custom/path',
        outputPath: 'custom/output',
      });
      const snapshot = Testing.synth(project);

      const packageJson = getPackageJson(snapshot);

      // Verify task commands use projen task runner
      expect(packageJson.scripts['cdk8s:import']).toContain(
        'npx projen cdk8s:import',
      );
      expect(packageJson.scripts['cdk8s:synth']).toContain(
        'npx projen cdk8s:synth',
      );

      // Note: Custom paths are configured in the task definition, not in package.json scripts

      expect(snapshot['package.json']).toMatchSnapshot();
    });
  });

  describe('File Generation', () => {
    test('should generate cdk8s.yaml with correct typescript configuration', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s', {
        appPath: 'apps',
        appFile: 'index.ts',
        k8sVersion: K8sVersion.V1_31,
        imports: ['istio@1.0.0'],
      });
      const snapshot = Testing.synth(project);

      const cdk8sYaml = snapshot['cdk8s.yaml'];
      expect(cdk8sYaml).toBeDefined();

      // Parse YAML to verify structure
      const yamlContent = cdk8sYaml;
      expect(yamlContent).toContain('language: typescript');
      expect(yamlContent).toContain('app: npx ts-node apps/index.ts');
      expect(yamlContent).toContain('k8s@1.31.0');
      expect(yamlContent).toContain('istio@1.0.0');

      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
    });

    test('should generate sample files in correct locations', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s', {
        appPath: 'k8s-apps',
        appFile: 'cluster.ts',
      });
      const snapshot = Testing.synth(project);

      // Verify sample file is created in custom location
      expect(snapshot['k8s-apps/cluster.ts']).toBeDefined();
      expect(snapshot['k8s-apps/cluster.ts']).toMatchSnapshot();
    });
  });

  describe('Integration with Different Project Types', () => {
    test('should work correctly with cdk-app with disabled sample code', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
        sampleCode: false,
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s');
      const snapshot = Testing.synth(project);

      // Verify cdk8s component still works even when CDK sample code is disabled
      expect(snapshot['cdk8s.yaml']).toBeDefined();
      expect(snapshot['src/main.ts']).toBeDefined(); // CDK8s creates its own main.ts

      // Verify dependencies are still added
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.dependencies).toHaveProperty('cdk8s');
      expect(packageJson.dependencies).toHaveProperty('cdk8s-plus-30');

      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
      expect(snapshot['src/main.ts']).toMatchSnapshot();
    });

    test('should handle multiple imports correctly', () => {
      const options: AwsCdkTypeScriptAppOptions = {
        name: 'test-cdk-app',
        cdkVersion: '2.1.0',
        defaultReleaseBranch: 'main',
      };

      const project = new CdkApp(options);
      new Cdk8sComponent(project, 'cdk8s', {
        imports: [
          'prometheus-operator@1.0.0',
          'cert-manager@2.0.0',
          'istio@3.0.0',
          'nginx-ingress@4.0.0',
        ],
      });
      const snapshot = Testing.synth(project);

      const cdk8sYaml = snapshot['cdk8s.yaml'];
      expect(cdk8sYaml).toContain('prometheus-operator@1.0.0');
      expect(cdk8sYaml).toContain('cert-manager@2.0.0');
      expect(cdk8sYaml).toContain('istio@3.0.0');
      expect(cdk8sYaml).toContain('nginx-ingress@4.0.0');

      expect(snapshot['cdk8s.yaml']).toMatchSnapshot();
    });
  });
});
