import { Component, Project, YamlFile } from 'projen';
import { ApiVersion, K3dConfig } from './types';

export class K3dBase extends Component {
  constructor(project: Project, id: string) {
    super(project, id);

    const k3dConfig: K3dConfig = {
      apiVersion: ApiVersion.V1_ALPHA_5,
      kind: 'Simple',
    };
    new YamlFile(project, 'k3d.yaml', {
      obj: k3dConfig,
    });
  }
}
