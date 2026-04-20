# ReshetComponents

`ReshetComponents` is a standalone React component library extracted from the Daba frontend `baseComponents`.

The npm package name is `reshet-components` because npm package names must be lowercase.

## Install

```bash
npm install reshet-components
```

## Usage

Import components directly from the package:

```tsx
import { Button, DatePicker, Tooltip } from 'reshet-components';
```

The package entry loads its stylesheet automatically. `reshet-components/styles.css` is still exported if you want a direct style import for a custom setup.

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
2. Keep `package.json` `repository.url` aligned with the publishing repository. For this repo it must match `https://github.com/ShpakovNetanel/ReshetComponents`, or npm provenance validation will reject the publish.
3. Choose one CI auth path:
   - Recommended: configure npm trusted publishing for this repository and workflow filenames.
   - Token fallback: add a GitHub secret named `NPM_TOKEN` that contains a granular npm access token with write access to `reshet-components` and `Bypass two-factor authentication` enabled.
4. If your default branch is not `main`, update [publish-canary.yml](./.github/workflows/publish-canary.yml).

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

If you keep using `NPM_TOKEN`, make sure the package's npm publishing access is not set to `Require two-factor authentication and disallow tokens`, because that setting blocks token-based CI publishes entirely.

### Automatic canary releases

Every push to `main` triggers the `publish-canary` workflow. It publishes a version shaped like:

```text
0.1.0-canary.20260419153045.sha1a2b3c4
```

Consumers can install the moving canary channel with:

```bash
npm install reshet-components@canary
```

The GitHub Actions workflows in this repo already include `id-token: write` and run on a Node version that supports npm trusted publishing, so once trusted publishing is configured on npm they can publish without a long-lived write token.
