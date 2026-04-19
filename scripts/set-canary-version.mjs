import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const packageJsonPath = path.join(cwd, 'package.json');
const packageLockPath = path.join(cwd, 'package-lock.json');

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, '')
  .replace(/\.\d{3}Z$/, 'Z')
  .replace(/[TZ]/g, '');

const sha = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local';

const updateVersionFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const baseVersion = parsed.version.replace(/[-+].*$/, '');
  const nextVersion = `${baseVersion}-canary.${timestamp}.sha${sha}`;

  parsed.version = nextVersion;

  fs.writeFileSync(filePath, `${JSON.stringify(parsed, null, 2)}\n`);

  return nextVersion;
};

const version = updateVersionFile(packageJsonPath);
updateVersionFile(packageLockPath);

if (!version) {
  throw new Error('package.json was not found.');
}

console.log(`Prepared canary version: ${version}`);
