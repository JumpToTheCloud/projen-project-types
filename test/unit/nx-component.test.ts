import { Project, Testing } from 'projen';
import { TypeScriptProject } from 'projen/lib/typescript';
import { NxComponent, NxVersion } from '../../src/components';

describe('Nx Component', () => {
  let project: Project;

  beforeEach(() => {
    project = new TypeScriptProject({
      name: 'test-project',
      defaultReleaseBranch: 'main',
    });
  });
  describe('Dependency installation', () => {
    it('should install default nx version', () => {
      new NxComponent(project, 'nx-component');

      const output = Testing.synth(project);

      expect(output['package.json'].devDependencies.nx).toBeDefined();
      expect(output['package.json'].devDependencies.nx).toBe(
        `^${NxVersion.V22}`,
      );
    });
    it('should install specific version of nx', () => {
      new NxComponent(project, 'nx-component', { nxVersion: NxVersion.V21 });

      const output = Testing.synth(project);

      expect(output['package.json'].devDependencies.nx).toBeDefined();
      expect(output['package.json'].devDependencies.nx).toBe(
        `^${NxVersion.V21}`,
      );
    });
  });
});
