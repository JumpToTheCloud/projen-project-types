import { Testing } from 'projen/lib/testing';
import { NxMonorepoOptions } from '../src/monorepo/interfaces/NxMonorepo';
import { NxMonorepo } from '../src/monorepo/monorepo';

// Helper function to parse package.json from snapshot
function getPackageJson(snapshot: Record<string, any>): any {
  const packageJsonContent = snapshot['package.json'];
  return typeof packageJsonContent === 'string'
    ? JSON.parse(packageJsonContent)
    : packageJsonContent;
}

// Helper function to parse tasks.json from snapshot
function getTasksJson(snapshot: Record<string, any>): any {
  const tasksJsonContent = snapshot['.projen/tasks.json'];
  return typeof tasksJsonContent === 'string'
    ? JSON.parse(tasksJsonContent)
    : tasksJsonContent;
}

// Helper function to parse nx.json from snapshot
function getNxJson(snapshot: Record<string, any>): any {
  const nxJsonContent = snapshot['nx.json'];
  return typeof nxJsonContent === 'string'
    ? JSON.parse(nxJsonContent)
    : nxJsonContent;
}

describe('NxMonorepo', () => {
  describe('Basic Configuration', () => {
    test('should create nx monorepo with default settings', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      // Verify nx.json configuration file exists
      expect(snapshot['nx.json']).toBeDefined();

      // Snapshot test for nx configuration
      expect(snapshot['nx.json']).toMatchSnapshot();
    });

    test('should include nx dependencies in package.json', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const packageJson = getPackageJson(snapshot);

      // Verify nx dependencies are included as dev dependencies
      expect(packageJson.devDependencies).toHaveProperty('nx');
      expect(packageJson.devDependencies).toHaveProperty('@nx/workspace');
      expect(packageJson.devDependencies).toHaveProperty('@nx/devkit');
    });

    test('should configure workspaces in package.json', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const packageJson = getPackageJson(snapshot);

      // Verify workspace configuration
      expect(packageJson.private).toBe('true');
      expect(packageJson.workspaces).toEqual(['packages/*']);
    });
  });

  describe('NX Configuration', () => {
    test('should configure affected settings correctly', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const nxJson = getNxJson(snapshot);

      // Verify affected configuration
      expect(nxJson.affected).toBeDefined();
      expect(nxJson.affected.defaultBase).toBe('main');
    });

    test('should configure named inputs properly', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const nxJson = getNxJson(snapshot);

      // Verify named inputs configuration
      expect(nxJson.namedInput).toBeDefined();
      expect(nxJson.namedInput.default).toBeDefined();
      expect(nxJson.namedInput.production).toBeDefined();
      expect(nxJson.namedInput.testing).toBeDefined();
    });

    test('should configure release settings with conventional commits', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const nxJson = getNxJson(snapshot);

      // Verify release configuration
      expect(nxJson.release).toBeDefined();
      expect(nxJson.release.projects).toEqual(['*']);
      expect(nxJson.release.version.conventionalCommits).toBe(true);
      expect(nxJson.release.changelog.workspaceChangelog.createRelease).toBe(
        'github',
      );
    });

    test('should configure target defaults', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const nxJson = getNxJson(snapshot);

      // Verify target defaults are configured
      expect(nxJson.targetDefaults).toBeDefined();
      expect(nxJson.targetDefaults.default).toBeDefined();
      expect(nxJson.targetDefaults.build).toBeDefined();
    });

    test('should configure task runner options', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const nxJson = getNxJson(snapshot);

      // Verify task runner options
      expect(nxJson.taskRunnerOptions).toBeDefined();
      expect(nxJson.taskRunnerOptions.default).toBeDefined();
      expect(nxJson.taskRunnerOptions.default.runner).toBe(
        'nx/tasks-runners/default',
      );
    });
  });

  describe('Task Configuration', () => {
    test('should create nx-specific tasks', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      // Verify .projen/tasks.json contains nx tasks
      expect(snapshot['.projen/tasks.json']).toBeDefined();

      const tasksJson = getTasksJson(snapshot);

      // Verify nx-specific tasks exist
      expect(tasksJson.tasks.build).toBeDefined();
      expect(tasksJson.tasks.test).toBeDefined();
      expect(tasksJson.tasks.compile).toBeDefined();
      expect(tasksJson.tasks.eslint).toBeDefined();
      expect(tasksJson.tasks.package).toBeDefined();
      expect(tasksJson.tasks['test:watch']).toBeDefined();
      expect(tasksJson.tasks.graph).toBeDefined();
      expect(tasksJson.tasks.release).toBeDefined();
      expect(tasksJson.tasks['run-many']).toBeDefined();
      expect(tasksJson.tasks.nx).toBeDefined();
    });

    test('should configure build task to use nx run-many', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      const tasksJson = getTasksJson(snapshot);
      const buildTask = tasksJson.tasks.build;

      expect(buildTask.steps).toBeDefined();
      expect(buildTask.steps[0].exec).toContain('nx run-many --target=build');
    });

    test('should configure test:watch task correctly', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      const tasksJson = getTasksJson(snapshot);
      const testWatchTask = tasksJson.tasks['test:watch'];

      expect(testWatchTask.steps).toBeDefined();
      expect(testWatchTask.steps[0].exec).toContain(
        'nx run-many --target=test:watch',
      );
      expect(testWatchTask.steps[0].exec).toContain('--skip-nx-cache');
    });
  });

  describe('GitHub Workflow Configuration', () => {
    test('should create publish workflow', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      // Verify publish workflow exists
      expect(snapshot['.github/workflows/publish.yml']).toBeDefined();

      // Snapshot test for publish workflow
      expect(snapshot['.github/workflows/publish.yml']).toMatchSnapshot();
    });

    test('should configure publish workflow with correct triggers', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      const workflowContent = snapshot['.github/workflows/publish.yml'];

      // Verify workflow triggers
      expect(workflowContent).toContain('- published');
      expect(workflowContent).toContain('workflow_dispatch');
    });
  });

  describe('Git Configuration', () => {
    test('should include .nx in gitignore', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      // Verify .gitignore includes .nx
      expect(snapshot['.gitignore']).toContain('.nx');
    });
  });

  describe('Commitzent Integration', () => {
    test('should include commitzent by default', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);
      const packageJson = getPackageJson(snapshot);

      // Verify commitzent dependencies
      expect(packageJson.devDependencies).toHaveProperty('commitizen');
      expect(packageJson.devDependencies).toHaveProperty('cz-customizable');

      // Verify commitzent configuration files
      expect(snapshot['.cz-config.js']).toBeDefined();
    });
  });

  describe('Complete Project Snapshot', () => {
    test('should generate complete nx monorepo project structure', () => {
      const options: NxMonorepoOptions = {
        name: 'test-nx-monorepo',
        defaultReleaseBranch: 'main',
        description: 'Test NX monorepo project',
        authorName: 'Test Author',
        authorEmail: 'test@example.com',
        repository: 'https://github.com/test/test-nx-monorepo.git',
      };

      const project = new NxMonorepo(options);
      const snapshot = Testing.synth(project);

      // Snapshot test for complete project structure
      expect(snapshot).toMatchSnapshot();
    });
  });
});
