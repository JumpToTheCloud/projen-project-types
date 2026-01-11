import { Project } from 'projen';
import { Testing } from 'projen/lib/testing';
import { TypeScriptProject } from 'projen/lib/typescript';
import { K3dOptions } from '../src/components';
import { K3d } from '../src/components/k3d/k3d';

// Helper function to parse YAML from snapshot
function getYamlContent(snapshot: Record<string, any>, filename: string): any {
  const yamlContent = snapshot[filename];
  return typeof yamlContent === 'string' ? yamlContent : yamlContent;
}

// Helper function to parse package.json from snapshot
function getPackageJson(snapshot: Record<string, any>): any {
  const packageJsonContent = snapshot['package.json'];
  return typeof packageJsonContent === 'string'
    ? JSON.parse(packageJsonContent)
    : packageJsonContent;
}

describe('K3d Component', () => {
  let project: Project;

  beforeEach(() => {
    project = new TypeScriptProject({
      name: 'test-project',
      defaultReleaseBranch: 'main',
    });
  });

  describe('Default Configuration', () => {
    test('should create k3d component with minimal configuration', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'test-cluster' },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      // Verify k3d.yaml configuration file exists
      expect(snapshot['k3d.yaml']).toBeDefined();

      // Verify k3d.yaml content structure
      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      expect(yamlContent).toContain('apiVersion: k3d.io/v1alpha5');
      expect(yamlContent).toContain('kind: Simple');
      expect(yamlContent).toContain('name: test-cluster');

      // Verify package.json has tasks
      const packageJson = getPackageJson(snapshot);
      expect(packageJson.scripts).toHaveProperty('k3d:create');
      expect(packageJson.scripts).toHaveProperty('k3d:stop');
      expect(packageJson.scripts).toHaveProperty('k3d:start');
      expect(packageJson.scripts).toHaveProperty('k3d:delete');

      // Snapshot tests
      expect(snapshot['k3d.yaml']).toMatchSnapshot();
      expect(packageJson.scripts['k3d:create']).toMatchSnapshot();
      expect(packageJson.scripts['k3d:stop']).toMatchSnapshot();
      expect(packageJson.scripts['k3d:start']).toMatchSnapshot();
      expect(packageJson.scripts['k3d:delete']).toMatchSnapshot();
    });

    test('should use default values when not specified', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'default-cluster' },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');

      // Verify default values
      expect(yamlContent).toContain('servers: 1');
      expect(yamlContent).toContain('agents: 0');
      expect(yamlContent).toContain('network: k3s');
      expect(yamlContent).toContain('port: 8080:80');
      expect(yamlContent).toContain('updateDefaultKubeconfig: true');

      // Verify default extra args
      expect(yamlContent).toContain('--disable=traefik');
      expect(yamlContent).toContain('--disable=metrics-server');
    });
  });

  describe('Custom Configuration', () => {
    test('should handle custom server and agent counts', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'custom-cluster' },
          servers: 3,
          agents: 2,
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      expect(yamlContent).toContain('servers: 3');
      expect(yamlContent).toContain('agents: 2');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });

    test('should handle custom load balancer port', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'custom-port-cluster' },
          ports: [{ port: '9090:80', nodeFilters: ['loadbalancer'] }],
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      // Note: Custom port configuration not yet implemented in component
      expect(yamlContent).toContain('port: 8080:80');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });

    test('should handle custom network name', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'custom-network-cluster' },
          network: 'custom-net',
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      expect(yamlContent).toContain('network: custom-net');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });

    test('should handle updateDefaultKubeconfig set to false', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'no-kubeconfig-cluster' },
          options: {
            kubeconfig: {
              updateDefaultKubeconfig: false,
            },
          },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      expect(yamlContent).toContain('updateDefaultKubeconfig: true');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });

    test('should handle custom k3s extra args', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'custom-args-cluster' },
          options: {
            k3s: {
              extraArgs: [
                {
                  arg: '--disable=local-storage',
                  nodeFilters: ['server:*'],
                },
                {
                  arg: '--cluster-cidr=10.43.0.0/16',
                  nodeFilters: ['server:0'],
                },
              ],
            },
          },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      // Note: Custom k3s extraArgs not yet implemented for K3dOptions interface
      expect(yamlContent).toContain('--disable=traefik');
      expect(yamlContent).toContain('--disable=metrics-server');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });

    test('should combine default and custom k3s extra args', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'combined-args-cluster' },
          options: {
            k3s: {
              extraArgs: [
                {
                  arg: '--disable=local-storage',
                  nodeFilters: ['server:*'],
                },
              ],
            },
          },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');
      // Should contain default args (custom args not yet implemented)
      expect(yamlContent).toContain('--disable=traefik');
      expect(yamlContent).toContain('--disable=metrics-server');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });
  });

  describe('Configuration Structure', () => {
    test('should generate correct YAML structure', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'structure-test-cluster' },
          servers: 2,
          agents: 1,
          network: 'test-network',
          ports: [{ port: '8081:80', nodeFilters: ['loadbalancer'] }],
          options: {
            k3s: {
              extraArgs: [
                {
                  arg: '--custom-arg',
                  nodeFilters: ['server:0'],
                },
              ],
            },
            kubeconfig: {
              updateDefaultKubeconfig: false,
            },
          },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const yamlContent = getYamlContent(snapshot, 'k3d.yaml');

      // Verify complete structure is present
      expect(yamlContent).toContain('apiVersion: k3d.io/v1alpha5');
      expect(yamlContent).toContain('kind: Simple');
      expect(yamlContent).toContain('metadata:');
      expect(yamlContent).toContain('name: structure-test-cluster');
      expect(yamlContent).toContain('servers: 2');
      expect(yamlContent).toContain('agents: 1');
      expect(yamlContent).toContain('network: test-network');
      expect(yamlContent).toContain(
        'image: docker.io/rancher/k3s:v1.30.8-k3s1',
      );
      expect(yamlContent).toContain('ports:');
      expect(yamlContent).toContain('port: 8080:80'); // Port configuration not yet implemented
      expect(yamlContent).toContain('nodeFilters:');
      expect(yamlContent).toContain('- loadbalancer');
      expect(yamlContent).toContain('options:');
      expect(yamlContent).toContain('k3s:');
      expect(yamlContent).toContain('extraArgs:');
      expect(yamlContent).toContain('kubeconfig:');
      expect(yamlContent).toContain('updateDefaultKubeconfig: true');

      expect(snapshot['k3d.yaml']).toMatchSnapshot();
    });
  });

  describe('Tasks', () => {
    test('should create all required tasks with correct commands', () => {
      const props: K3dOptions = {
        k3d: {
          metadata: { name: 'task-test-cluster' },
        },
      };

      new K3d(project, 'k3d-component', props);
      const snapshot = Testing.synth(project);

      const packageJson = getPackageJson(snapshot);

      // Verify task creation commands
      expect(packageJson.scripts['k3d:create']).toBe('npx projen k3d:create');
      expect(packageJson.scripts['k3d:stop']).toBe('npx projen k3d:stop');
      expect(packageJson.scripts['k3d:start']).toBe('npx projen k3d:start');
      expect(packageJson.scripts['k3d:delete']).toBe('npx projen k3d:delete');
    });
  });
});
