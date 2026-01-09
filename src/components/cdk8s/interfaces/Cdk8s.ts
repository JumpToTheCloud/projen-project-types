import { AwsCdkConstructLibraryOptions } from 'projen/lib/awscdk';
import { TypeScriptProjectOptions } from 'projen/lib/typescript';

export enum K8sVersion {
  V1_29 = '1.29.0',
  V1_30 = '1.30.0',
  V1_31 = '1.31.0',
  V1_32 = '1.32.0',
  V1_33 = '1.33.0',
}

export interface Cdk8sBaseOptions {
  /**
   * path of main file to execute the typescript transpilation
   *
   * @default "src/k8s"
   */
  readonly appPath?: string;

  /**
   * The name of the main file
   * @default main.ts
   */
  readonly appFile?: string;
  /**
   * List of kubernetes imports to be added
   */
  readonly imports?: string[];

  /**
   * The path where the output synthesized file will be saved
   * @default "kubernetes"
   */
  readonly outputPath?: string;

  /**
   * The kubernetes version to use
   * @default 1.31
   */
  readonly k8sVersion?: K8sVersion;
}

export interface Cdk8sLibraryOptions
  extends Cdk8sBaseOptions, AwsCdkConstructLibraryOptions {}

export interface Cdk8sAppOptions
  extends Cdk8sBaseOptions, TypeScriptProjectOptions {}
