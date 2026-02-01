import { Component, Project } from 'projen';
import { NodePackage } from 'projen/lib/javascript';
import { hasNx } from './nx-workspace';

export class NxNamedInput extends Component {
  constructor(project: Project, id: string) {
    super(project, id);

    let nodePackage = project.root.node.children.find(
      (child) => child instanceof NodePackage,
    ) as NodePackage;

    if (hasNx(project)) {
      project.nx.addNamedInput('default', [
        `{projectRoot}/**/*`,
        'sharedGlobals',
      ]);
      project.nx.addNamedInput('production', [
        'default',
        '!{projectRoot}/**/*.spec.ts',
        '!{projectRoot}/**/*.test.ts',
        '!{projectRoot}/**/*.snap',
        '!{projectRoot}/test/**',
        '!{projectRoot}/tests/**',
        '!{projectRoot}/**/*.md',
      ]);
      project.nx.addNamedInput('test', ['default']);
      project.nx.addNamedInput('sharedGlobals', [
        '{workspaceRoot}/nx.json',
        '{workspaceRoot}/tsconfig.dev.json',
        '{workspaceRoot}/package.json',
        `{workspaceRoot}/${nodePackage.lockFile}`,
        '{workspaceRoot}/.projenrc.ts',
      ]);
    }
  }
}
