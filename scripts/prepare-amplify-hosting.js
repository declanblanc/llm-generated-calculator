const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const hostingDir = path.join(rootDir, '.amplify-hosting');
const computeDir = path.join(hostingDir, 'compute', 'default');
const staticDir = path.join(computeDir, 'static');
const frontendDistDir = path.join(rootDir, 'frontend', 'dist');
const backendNodeModulesDir = path.join(rootDir, 'backend', 'node_modules');
const backendPackageJsonPath = path.join(rootDir, 'backend', 'package.json');
const backendAmplifyServerPath = path.join(rootDir, 'backend', 'src', 'amplify-server.js');
const calculateModulePath = path.join(rootDir, 'backend', 'src', 'calculate.js');

function ensurePathExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} not found: ${targetPath}`);
  }
}

function buildComputePackageJson() {
  const backendPackage = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
  const dependencies = backendPackage.dependencies ?? {};
  const runtimeDependencies = Object.fromEntries(
    Object.entries(dependencies).filter(([, version]) => !String(version).startsWith('file:'))
  );

  return {
    name: 'calculator-amplify-compute',
    version: '1.0.0',
    private: true,
    main: 'server.js',
    scripts: {
      start: 'node server.js',
    },
    dependencies: runtimeDependencies,
  };
}

function writeManifest() {
  const manifest = {
    version: 1,
    routes: [
      {
        path: '/*',
        target: {
          kind: 'Compute',
          src: 'default',
        },
      },
    ],
    computeResources: [
      {
        name: 'default',
        entrypoint: 'server.js',
        runtime: 'nodejs20.x',
      },
    ],
  };

  fs.writeFileSync(
    path.join(hostingDir, 'deploy-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );
}

function copyRecursive(from, to) {
  fs.cpSync(from, to, { recursive: true });
}

function main() {
  ensurePathExists(frontendDistDir, 'Frontend build output');
  ensurePathExists(backendNodeModulesDir, 'Backend node_modules');
  ensurePathExists(backendAmplifyServerPath, 'Amplify backend server');
  ensurePathExists(calculateModulePath, 'Calculator module');

  fs.rmSync(hostingDir, { recursive: true, force: true });
  fs.mkdirSync(computeDir, { recursive: true });

  copyRecursive(frontendDistDir, staticDir);
  copyRecursive(backendNodeModulesDir, path.join(computeDir, 'node_modules'));
  fs.copyFileSync(backendAmplifyServerPath, path.join(computeDir, 'server.js'));
  fs.copyFileSync(calculateModulePath, path.join(computeDir, 'calculate.js'));

  const computePackageJson = buildComputePackageJson();
  fs.writeFileSync(
    path.join(computeDir, 'package.json'),
    `${JSON.stringify(computePackageJson, null, 2)}\n`,
    'utf8'
  );

  writeManifest();
  console.log('Prepared Amplify hosting bundle at .amplify-hosting/');
}

main();
