# ReshetComponents

`ReshetComponents` is a standalone React component library extracted from the Daba frontend `baseComponents`.

The npm package name is `reshet-components` because npm package names must be lowercase.

## Install

```bash
npm install reshet-components
```

## Usage

Import the package styles once in your app entry:

```ts
import 'reshet-components/styles.css';
```

Then import components from the package:

```tsx
import { Button, DatePicker, Tooltip } from 'reshet-components';
```

## Notes

- `react` and `react-dom` are peer dependencies.
- The package ships a default light/dark token set in `styles.css`.
- Some components depend on `@base-ui/react`, `react-day-picker`, `react-hot-toast`, `lucide-react`, `clsx`, `remeda`, and `date-fns`, which are installed as package dependencies.

## Publishing

This repository is configured for two npm release channels:

- `latest`: published from Git tags like `v0.1.0`
- `canary`: published automatically on every push to `main`

npm does not allow publishing the same package version twice, so each canary publish gets a unique pre-release version automatically.

### One-time setup

1. Create the package once on npm with an account that owns `reshet-components`.
2. In GitHub, add a repository secret named `NPM_TOKEN` with an npm automation token that can publish this package.
3. If your default branch is not `main`, update [publish-canary.yml](./.github/workflows/publish-canary.yml).

### First stable publish

If `0.1.0` has never been published before:

```bash
npm publish
```

`prepack` will build the package before publishing.

### Stable releases after that

Bump the version locally, create the matching git tag, and push it:

```bash
npm version patch
git push --follow-tags
```

The `publish-release` workflow will publish that exact version to npm under the `latest` tag.

### Automatic canary releases

Every push to `main` triggers the `publish-canary` workflow. It publishes a version shaped like:

```text
0.1.0-canary.20260419153045.sha1a2b3c4
```

Consumers can install the moving canary channel with:

```bash
npm install reshet-components@canary
```
