import { Testing } from 'projen/lib/testing';
import { CdktfLibrary } from '../src/cdk/cdktf-library-project';
import { CdktfLibraryOptions } from '../src/cdk/interfaces';

// Helper function to parse package.json from snapshot
function getPackageJson(snapshot: Record<string, any>): any {
  const packageJsonContent = snapshot['package.json'];
  return typeof packageJsonContent === 'string'
    ? JSON.parse(packageJsonContent)
    : packageJsonContent;
}

describe('CdktfLibrary', () => {
  describe('Basic Configuration', () => {
    test('should create a CDKTF library project with default options', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify package.json exists
      expect(snapshot['package.json']).toBeDefined();

      const packageJson = getPackageJson(snapshot);
      expect(packageJson.name).toBe('test-cdktf-library');
      expect(packageJson.author).toEqual({
        name: 'test-author',
        email: 'test@example.com',
        organization: false,
      });
    });

    test('should include CDKTF dependencies in package.json', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      const packageJson = getPackageJson(snapshot);

      // Verify CDKTF related dependencies
      expect(packageJson.peerDependencies).toBeDefined();
      expect(packageJson.peerDependencies.cdktf).toBeDefined();
      expect(packageJson.peerDependencies.constructs).toBeDefined();
    });
  });

  describe('Prettier Configuration', () => {
    test('should configure prettier with default options when not specified', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file exists
      expect(snapshot['.prettierrc.json']).toBeDefined();

      // Snapshot test for prettier configuration
      expect(snapshot['.prettierrc.json']).toMatchSnapshot();
    });

    test('should not override prettier when explicitly set to false', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
        prettier: false,
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify prettier configuration file does not exist when disabled
      expect(snapshot['.prettierrc.json']).toBeUndefined();
    });
  });

  describe('ESLint Configuration', () => {
    test('should configure eslint with default options', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify eslint configuration exists
      expect(snapshot['.eslintrc.json']).toBeDefined();

      // Snapshot test for eslint configuration
      expect(snapshot['.eslintrc.json']).toMatchSnapshot();
    });
  });

  describe('Commitzent Configuration', () => {
    test('should include commitzent by default', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
      };

      const project = new CdktfLibrary(options);

      expect(project.commitzent).toBeDefined();
    });

    test('should exclude commitzent when explicitly disabled', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
        commitzent: false,
      };

      const project = new CdktfLibrary(options);

      expect(project.commitzent).toBeUndefined();
    });
  });

  describe('JSII Configuration', () => {
    test('should configure JSII for multi-language support', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
        publishToPypi: {
          distName: 'test-cdktp-library',
          module: 'test_cdktp_library',
        },
        publishToMaven: {
          javaPackage: 'com.test.cdktplibrary',
          mavenGroupId: 'com.test',
          mavenArtifactId: 'test-cdktp-library',
        },
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      const packageJson = getPackageJson(snapshot);

      // Verify JSII configuration
      expect(packageJson.jsii).toBeDefined();
      expect(packageJson.jsii.targets).toBeDefined();
      expect(packageJson.jsii.targets.python).toBeDefined();
      expect(packageJson.jsii.targets.java).toBeDefined();
    });
  });

  describe('TypeScript Configuration', () => {
    test('should create proper TypeScript configuration', () => {
      const options: CdktfLibraryOptions = {
        name: 'test-cdktp-library',
        author: 'test-author',
        authorAddress: 'test@example.com',
        repositoryUrl: 'https://github.com/test/test-cdktp-library.git',
        defaultReleaseBranch: 'main',
        cdktfVersion: '^0.13.0',
      };

      const project = new CdktfLibrary(options);
      const snapshot = Testing.synth(project);

      // Verify that the project was created successfully
      const packageJson = getPackageJson(snapshot);
      expect(packageJson).toBeDefined();
      expect(packageJson.name).toBe('test-cdktp-library');

      // Verify JSII configuration exists for TypeScript compilation
      expect(packageJson.jsii).toBeDefined();
    });
  });
});
