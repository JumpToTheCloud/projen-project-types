import { execSync } from 'child_process';
import * as path from 'path';
import {
  Component,
  DependencyType,
  Project,
  SampleFile,
  YamlFile,
} from 'projen';

import { K8sVersion, Cdk8sBaseOptions } from './interfaces/Cdk8s';

export class Cdk8sComponent extends Component {
  readonly appPath: string = 'src';
  readonly appFile: string = 'main.ts';
  readonly imports: string[];
  readonly outputPath: string = 'kubernetes';
  readonly k8sVersion: K8sVersion = K8sVersion.V1_30;

  constructor(project: Project, id: string, props?: Cdk8sBaseOptions) {
    super(project, id);

    if (props && props.k8sVersion) {
      this.k8sVersion = props.k8sVersion;
    }

    this.imports = [`k8s@${this.k8sVersion}`];

    if (props && props.appPath) {
      this.appPath = props.appPath;
    }

    if (props && props.appFile) {
      this.appFile = props.appFile;
    }

    if (props && props.outputPath) {
      this.outputPath = props.outputPath;
    }

    if (props && props.imports) {
      props.imports.forEach((importPath) => {
        this.imports.push(importPath);
      });
    }

    const cdk8sPlusVersion = `cdk8s-plus-${this.k8sVersion.split('.')[1]}`;

    // Note: constructs dependency is now managed by the BaseProject dependency override system
    // to avoid conflicts between different project types
    project.deps.addDependency('cdk8s', DependencyType.RUNTIME);
    project.deps.addDependency('cdk8s-cli', DependencyType.BUILD);
    project.deps.addDependency(cdk8sPlusVersion, DependencyType.RUNTIME);

    // Get pjid from initProject (available in CLI usage and mocked in tests)
    const pjid = project.initProject?.type.pjid;

    project.addTask('cdk8s', {
      description: 'CDK8s command',
      steps: [
        {
          exec: 'cdk8s',
          say: 'cdk for kubernetes',
          receiveArgs: true,
        },
      ],
    });

    project.addTask('cdk8s:import', {
      description: 'Import cdk8s charts',
      steps: [
        {
          exec: `cdk8s import --output ${this.appPath}/imports`,
          say: 'Importing kubernetes files',
          receiveArgs: true,
        },
      ],
    });

    if (pjid !== 'cdk8s-library') {
      project.addTask('cdk8s:synth', {
        description: 'Synthesized cdk8s constructs',
        steps: [
          {
            exec: `cdk8s synth --output ${this.outputPath}`,
            say: 'Synthesizing kubernetes files',
            receiveArgs: true,
          },
        ],
      });
    }

    new YamlFile(project, 'cdk8s.yaml', {
      obj: {
        language: 'typescript',
        app: `npx ts-node ${this.appPath}/${this.appFile}`,
        imports: this.imports,
      },
    });
    if (pjid === 'cdk8s-library') {
      new SampleFile(project, `${this.appPath}/${this.appFile}`, {
        sourcePath: path.join(__dirname, 'main-library.ts.template'),
      });
    } else {
      new SampleFile(project, `${this.appPath}/${this.appFile}`, {
        sourcePath: path.join(__dirname, 'main.ts.template'),
      });
    }

    if (pjid === 'cdk8s-library' || pjid === 'cdk8s-app') {
      new SampleFile(project, 'test/main.test.ts', {
        sourcePath: path.join(__dirname, 'main.test.ts.template'),
      });
    }
  }

  postSynthesize(): void {
    const cdk8sImportTask = this.project.tasks.tryFind('cdk8s:import');
    if (cdk8sImportTask) {
      execSync(this.project.runTaskCommand(cdk8sImportTask));
    }
  }
}
