export enum ApiVersion {
  V1_ALPHA_5 = 'k3d.io/v1alpha5',
}

export interface Metadata {
  readonly name: string;
}

export interface KubeAPI {
  readonly host: string;
  readonly hostIP: string;
  readonly hostPort: string;
}

export interface PortConfig {
  readonly port: string;
  readonly nodeFilters: string[];
}

export interface ArgConfig {
  readonly arg: string;
  readonly nodeFilters: string[];
}

export interface K3s {
  readonly extraArgs: ArgConfig[];
}

export interface Kubeconfig {
  readonly updateDefaultKubeconfig: boolean;
}

export interface LoadbalancerConfig {
  readonly configOverrides: string[];
}

export interface K3dConfig {
  /**
   * wait for cluster to be usable before returning; same as `--wait` (default: true)
   */
  readonly wait?: boolean;

  /**
   * wait timeout before aborting; same as `--timeout 60s`
   */
  readonly timeout?: string;
  readonly disableLoadbalancer?: boolean;
  readonly disableImageVolume?: boolean;
  readonly disableRollback?: boolean;
  readonly loadbalancer?: LoadbalancerConfig;
}

export interface K3dOptions {
  readonly k3d?: K3dConfig;
  readonly k3s?: K3s;
  readonly kubeconfig?: Kubeconfig;
}

export interface Volume {
  readonly volumeName: string;
  readonly nodeFilters: string[];
}

export interface K3dConfig {
  readonly apiVersion?: ApiVersion;
  readonly kind?: string;
  readonly metadata?: Metadata;
  readonly servers?: number;
  readonly agents?: number;
  readonly image?: string;
  readonly network?: string;
  readonly kubeAPI?: KubeAPI;
  readonly volumes?: Volume[];
  readonly ports?: PortConfig[];
  readonly options?: K3dOptions;
}
