import fs from 'node:fs';
import path from 'node:path';

const outDir = process.argv[2] ?? 'dist';
const entryPath = path.resolve(process.cwd(), outDir, 'index.js');
const cssImport = "import './styles.css';\n";

if (!fs.existsSync(entryPath)) {
  throw new Error(`Built entry file was not found at ${entryPath}`);
}

const current = fs.readFileSync(entryPath, 'utf8');

if (current.startsWith(cssImport)) {
  console.log(`CSS import already present in ${entryPath}`);
  process.exit(0);
}

fs.writeFileSync(entryPath, `${cssImport}${current}`);
console.log(`Injected CSS import into ${entryPath}`);
