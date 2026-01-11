import { Component, Project, YamlFile } from 'projen';
import { ApiVersion, ArgConfig, K3dConfig, K3dOptions } from './types';

export interface K3dProps {
  readonly name: string;
  /**
   * Control Plane number of servers
   * @default 3
   */
  readonly servers?: number;

  /**
   * Number of worker nodes
   * @default 0
   */
  readonly agents?: number;
  readonly k3sExtraArgs?: ArgConfig[];
  readonly loadBalancerPort?: number;
  /**
   * @default true
   */
  readonly updateDefaultKubeconfig?: boolean;

  /**
   * Name of the docker network
   * @default aws
   */
  readonly network?: string;
}

export class K3d extends Component {
  private k3sExtraArgs: ArgConfig[] = [];
  private loadBalancerPort: number = 8080;
  private clusterName: string;

  constructor(project: Project, id: string, props?: K3dOptions) {
    super(project, id);

    this.clusterName = props?.k3d?.metadata?.name || project.name;

    // TODO: Enable load balancer port number
    /* if (props?.k3d?.loadbalancer) {
      this.loadBalancerPort = props.loadBalancerPort;
    } */

    this.addDefaultExtraArgs();

    if (props?.k3s?.extraArgs) {
      props.k3s.extraArgs.forEach((arg) => {
        this.k3sExtraArgs.push(arg);
      });
    }

    const k3dConfig: K3dConfig = {
      apiVersion: ApiVersion.V1_ALPHA_5,
      kind: 'Simple',
      metadata: {
        name: this.clusterName,
      },
      servers: props?.k3d?.servers || 1,
      agents: props?.k3d?.agents || 0,
      network: props?.k3d?.network || 'k3s',
      image: 'docker.io/rancher/k3s:v1.30.8-k3s1',
      ports: [
        {
          port: `${this.loadBalancerPort}:80`,
          nodeFilters: ['loadbalancer'],
        },
      ],
      options: {
        k3s: {
          extraArgs: this.k3sExtraArgs,
        },
        kubeconfig: {
          updateDefaultKubeconfig:
            props?.kubeconfig?.updateDefaultKubeconfig || true,
        },
      },
    };

    new YamlFile(project, 'k3d.yaml', {
      obj: k3dConfig,
    });

    project.addTask('k3d:create', {
      description: 'K3d Kubernetes Cluster',
      steps: [
        {
          spawn: 'default',
        },
        {
          exec: 'k3d cluster create --config k3d.yaml',
          say: 'Creating K3d Cluster',
        },
      ],
    });

    project.addTask('k3d:stop', {
      description: 'Stop K3d Kubernetes Cluster',
      steps: [
        {
          exec: `k3d cluster stop ${this.clusterName}`,
          say: 'Stopping K3d Cluster',
          receiveArgs: true,
        },
      ],
    });

    project.addTask('k3d:start', {
      description: 'Start K3d Kubernetes Cluster',
      steps: [
        {
          exec: `k3d cluster start ${this.clusterName}`,
          say: 'Starting K3d Cluster',
          receiveArgs: true,
        },
      ],
    });

    project.addTask('k3d:delete', {
      description: 'Delete K3d Kubernetes Cluster',
      steps: [
        {
          exec: `k3d cluster delete ${this.clusterName}`,
          say: 'Deleting K3d Cluster',
          receiveArgs: true,
        },
      ],
    });
  }

  private addDefaultExtraArgs() {
    this.k3sExtraArgs.push({
      arg: '--disable=traefik',
      nodeFilters: ['server:*'],
    });
    this.k3sExtraArgs.push({
      arg: '--disable=metrics-server',
      nodeFilters: ['server:*'],
    });
  }
}
