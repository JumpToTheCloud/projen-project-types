import { Component, Project } from 'projen';
import { hasNx } from './nx-workspace';

export class NxTargetDefaults extends Component {
  constructor(project: Project, id: string) {
    super(project, id);

    if (hasNx(project)) {
    }
  }
}
