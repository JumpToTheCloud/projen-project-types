import { cdk } from 'projen';
const project = new cdk.JsiiProject({
  author: 'Antonio Márquez Pérez',
  authorAddress: 'antonio.marquez@jumptothecloud.tech',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.9.0',
  name: 'projen-project-types',
  projenrcTs: true,
  repositoryUrl: 'git@github.com:JumpToTheCloud/projen-project-types.git',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();