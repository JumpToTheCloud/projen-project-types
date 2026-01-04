import { cdk, ReleasableCommits } from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import {
  AppPermission,
  JobPermission,
} from 'projen/lib/github/workflows-model';
import {
  NpmAccess,
  Prettier,
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
  deps: ['projen'],
  // description: undefined,
  devDeps: ['projen', 'constructs@^10.4.4', 'commitizen', 'cz-customizable'],
  peerDeps: ['projen', 'constructs@^10.4.4'],
  packageName: '@jttc/projen-project-types',
  npmAccess: NpmAccess.PUBLIC,
});

new Prettier(project, {
  settings: {
    trailingComma: TrailingComma.ALL,
    singleQuote: true,
    bracketSpacing: true,
    semi: true,
  },
  ignoreFileOptions: {
    ignorePatterns: ['*.md'],
  },
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

const deployDocs = project.github?.addWorkflow('deploy-docs');
deployDocs?.on({
  workflowDispatch: {},
  workflowRun: {
    workflows: ['release'],
    types: ['completed'],
  },
  workflowCall: {
    inputs: {
      version: {
        required: false,
        type: 'string',
        description: 'Version to build and publish docs',
      },
      alias: {
        required: false,
        type: 'string',
        description: 'Alias to associate version (latest, stage)',
      },
    },
  },
});

project.addGitIgnore('site');

project.prettier?.addIgnorePattern('*.md');

project.addTask('docs:build', {
  exec: 'mkdocs build',
});

project.addTask('docs:serve', {
  exec: 'mkdocs serve -a localhost:8099',
});

deployDocs?.addJob('deploy-docs', {
  permissions: {
    contents: JobPermission.WRITE,
    pages: JobPermission.WRITE,
  },
  runsOn: ['ubuntu-latest'],
  outputs: {
    getVersion: {
      stepId: 'getVersion',
      outputName: 'version',
    },
  },
  steps: [
    {
      uses: 'actions/checkout@v5',
      with: {
        'fetch-depth': 0,
      },
    },
    {
      uses: 'actions/setup-python@v5',
      with: {
        ['python-version']: '3.10',
      },
    },
    {
      run: 'echo "cache_id=$(date --utc "+%V")" >> $GITHUB_ENV',
    },
    {
      uses: 'actions/cache@v5',
      with: {
        key: 'mkdocs-material-${{ env.cache_id }}',
        path: '.cache',
      },
    },
    {
      name: 'Install doc generations dependencies',
      run: [
        'pip install --upgrade pip',
        'pip install -r docs/requirements.txt',
        'pip install mkdocs-material',
        'pip install mike',
      ].join('\n'),
    },
    {
      name: 'Setup docs deploy',
      run: [
        'git config user.name github-actions',
        'git config user.email github-actions@github.com',
      ].join('\n'),
    },
    {
      name: 'Get the version',
      id: 'getVersion',
      run: [
        'echo "version=$(git describe --tags --abbrev=0)"',
        'echo "version=$(git describe --tags --abbrev=0)" >> "$GITHUB_OUTPUT"',
      ].join('\n'),
    },
    {
      name: 'Build and deploy documentation',
      env: {
        ALIAS: 'latest',
        VERSION: '${{ steps.getVersion.outputs.version }}',
      },
      run: [
        'echo ${{ env.VERSION }}',
        'mike deploy --push --update-aliases ${{ env.VERSION }} ${{ env.ALIAS }}',
        'mike set-default --push ${{ env.ALIAS }}',
      ].join('\n'),
    },
  ],
});

project.synth();
