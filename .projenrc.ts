import { cdk, ReleasableCommits } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { AppPermission } from 'projen/lib/github/workflows-model';
import {
  NpmAccess,
  TrailingComma,
  UpgradeDependenciesSchedule,
} from 'projen/lib/javascript';
import { ReleaseTrigger } from 'projen/lib/release';

const project = new cdk.JsiiProject({
  author: 'Jumpt to the Cloud',
  authorAddress: 'antonio.marquez@jumptothecloud.tech',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.9.0',
  name: 'projen-project-types',
  projenrcTs: true,
  repositoryUrl: 'git@github.com:JumpToTheCloud/projen-project-types.git',
  prettier: true,
  prettierOptions: {
    settings: {
      trailingComma: TrailingComma.ES5,
      singleQuote: true,
      bracketSpacing: true,
      semi: true,
    },
  },
  autoMerge: false,
  mergify: false,
  autoApproveUpgrades: true,
  autoApproveOptions: {},
  release: true,
  releaseTrigger: ReleaseTrigger.workflowDispatch(),
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflowOptions: {
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  majorVersion: 1,
  prerelease: 'beta',
  jestOptions: {
    jestConfig: {
      verbose: true,
    },
  },
  githubOptions: {
    projenCredentials: GithubCredentials.fromApp({
      permissions: {
        pullRequests: AppPermission.WRITE,
        contents: AppPermission.WRITE,
      },
    }),
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: [
          'feat',
          'fix',
          'chore',
          'docs',
          'style',
          'refactor',
          'test',
          'revert',
          'ci',
        ],
      },
    },
  },
  // deps: [],
  // description: undefined,
  devDeps: ['commitizen', 'cz-customizable'],
  packageName: '@jttc/projen-project-types',
  npmAccess: NpmAccess.PUBLIC,
});

project.addTask('commit', {
  description:
    'Commit changes with conventional commits prompts provided by Commitizen',
  steps: [
    {
      exec: './node_modules/cz-customizable/standalone.js',
      receiveArgs: false,
      say: 'committing changes',
    },
  ],
});

project.synth();
