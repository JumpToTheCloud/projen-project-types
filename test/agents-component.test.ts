import { Testing } from 'projen/lib/testing';
import { CdkApp } from '../src/cdk/cdk-app-project';
import { CdkLibrary } from '../src/cdk/cdk-library-project';
import { Cdk8App } from '../src/cdk/cdk8s-app-project';
import { Cdk8sLibrary } from '../src/cdk/cdk8s-library-project';
import { Agents } from '../src/components/agents/agents';
import { K8sVersion } from '../src/components/cdk8s/interfaces/Cdk8s';

describe('Agents Component', () => {
  describe('Default Behavior', () => {
    test('should be included by default in CDK App projects', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
      });

      const synthesis = Testing.synth(project);

      expect(synthesis['AGENTS.md']).toBeDefined();
      expect(synthesis['AGENTS.md']).toContain('# Coding Agents Guide');
      expect(synthesis['AGENTS.md']).toContain('CDK Application Project');
      expect(synthesis['AGENTS.md']).toContain('npx cdk deploy');
    });

    test('should be included by default in CDK Library projects', () => {
      const project = new CdkLibrary({
        name: 'test-library',
        author: 'test',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test.git',
        defaultReleaseBranch: 'main',
        cdkVersion: '2.0.0',
      });

      const synthesis = Testing.synth(project);

      expect(synthesis['AGENTS.md']).toBeDefined();
      expect(synthesis['AGENTS.md']).toContain('# Coding Agents Guide');
      expect(synthesis['AGENTS.md']).toContain('CDK Construct Library Project');
      expect(synthesis['AGENTS.md']).toContain('npx projen docgen');
    });

    test('should be included by default in CDK8s App projects', () => {
      const project = new Cdk8App({
        name: 'test-cdk8s-app',
        defaultReleaseBranch: 'main',
        k8sVersion: K8sVersion.V1_30,
      });

      const synthesis = Testing.synth(project);

      expect(synthesis['AGENTS.md']).toBeDefined();
      expect(synthesis['AGENTS.md']).toContain('# Coding Agents Guide');
      expect(synthesis['AGENTS.md']).toContain('CDK8s Application Project');
      expect(synthesis['AGENTS.md']).toContain('npx cdk8s synth');
    });

    test('should be included by default in CDK8s Library projects', () => {
      const project = new Cdk8sLibrary({
        name: 'test-cdk8s-library',
        author: 'test',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test.git',
        defaultReleaseBranch: 'main',
        cdkVersion: '2.0.0',
        k8sVersion: K8sVersion.V1_30,
      });

      const synthesis = Testing.synth(project);

      expect(synthesis['AGENTS.md']).toBeDefined();
      expect(synthesis['AGENTS.md']).toContain('# Coding Agents Guide');
      expect(synthesis['AGENTS.md']).toContain(
        'CDK8s Construct Library Project',
      );
    });
  });

  describe('Customization Options', () => {
    test('should allow disabling agents component', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
        agents: false,
      });

      const synthesis = Testing.synth(project);

      expect(synthesis['AGENTS.md']).toBeUndefined();
    });

    test('should include custom content when provided', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app-with-custom-content',
        defaultReleaseBranch: 'main',
        agents: false, // Disable automatic agents component
      });

      // Create agents component with custom content
      new Agents(project, 'custom-agents', {
        customContent: ['This is custom content', 'for testing purposes'],
      });

      const synthesis = Testing.synth(project);

      expect(synthesis['AGENTS.md']).toContain('## Custom Content');
      expect(synthesis['AGENTS.md']).toContain('This is custom content');
      expect(synthesis['AGENTS.md']).toContain('for testing purposes');
    });
  });

  describe('Project Type Detection', () => {
    test('should detect TypeScript project type correctly', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
      });

      const synthesis = Testing.synth(project);
      const agentsContent = synthesis['AGENTS.md'];

      // Should contain CDK-specific content, not generic TypeScript content
      expect(agentsContent).toContain('CDK Application Project');
      expect(agentsContent).not.toContain(
        'This is a TypeScript project managed by Projen',
      );
    });

    test('should include project-specific commands', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
      });

      const synthesis = Testing.synth(project);
      const agentsContent = synthesis['AGENTS.md'];

      // Should contain CDK-specific commands
      expect(agentsContent).toContain('npx cdk deploy');
      expect(agentsContent).toContain('npx cdk diff');
      expect(agentsContent).toContain('npx cdk destroy');
      expect(agentsContent).toContain('npx cdk synth');
    });

    test('should include project-specific structure', () => {
      const project = new CdkLibrary({
        name: 'test-library',
        author: 'test',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test.git',
        defaultReleaseBranch: 'main',
        cdkVersion: '2.0.0',
      });

      const synthesis = Testing.synth(project);
      const agentsContent = synthesis['AGENTS.md'];

      // Should contain library-specific structure
      expect(agentsContent).toContain(
        'dist/                # Distribution packages (generated)',
      );
      expect(agentsContent).toContain(
        'API.md               # Generated API documentation',
      );
    });
  });

  describe('Content Quality', () => {
    test('should use correct Projen commands', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
      });

      const synthesis = Testing.synth(project);
      const agentsContent = synthesis['AGENTS.md'];

      // Should use npx projen commands, not npm commands
      expect(agentsContent).toContain('npx projen build');
      expect(agentsContent).toContain('npx projen test');
      expect(agentsContent).toContain('npx projen test:watch');
      expect(agentsContent).toContain('npx projen eslint');
      expect(agentsContent).toContain('npx projen package');
      expect(agentsContent).toContain('npx projen clobber');
      expect(agentsContent).toContain('npx projen upgrade');

      // Should not contain incorrect npm commands
      expect(agentsContent).not.toContain('npm test');
      expect(agentsContent).not.toContain('npm run build');
      expect(agentsContent).not.toContain('npm run eslint');
    });

    test('should be in English', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
      });

      const synthesis = Testing.synth(project);
      const agentsContent = synthesis['AGENTS.md'];

      // Should be in English
      expect(agentsContent).toContain('# Coding Agents Guide');
      expect(agentsContent).toContain('## What is Projen?');
      expect(agentsContent).toContain('## Dependency Management');

      // Should not contain Spanish
      expect(agentsContent).not.toContain('Guía para Agentes');
      expect(agentsContent).not.toContain('¿Qué es Projen?');
      expect(agentsContent).not.toContain('Gestión de Dependencias');
    });

    test('should include proper documentation links', () => {
      const project = new CdkApp({
        cdkVersion: '2.0.0',
        name: 'test-app',
        defaultReleaseBranch: 'main',
      });

      const synthesis = Testing.synth(project);
      const agentsContent = synthesis['AGENTS.md'];

      expect(agentsContent).toContain(
        '[Projen Documentation](https://projen.io/)',
      );
      expect(agentsContent).toContain(
        '[Projen API Reference](https://github.com/projen/projen/blob/main/API.md)',
      );
      expect(agentsContent).toContain(
        '[AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)',
      );
    });
  });
});
