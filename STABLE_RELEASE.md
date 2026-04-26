# Stable Release Commands

Use this file for stable npm releases of `reshet-components`.

Do not use `npm run version:canary` here.

## Check Versions

Current local package version:

```bash
npm pkg get version
```

Current published stable version on npm:

```bash
npm view reshet-components version
```

Current npm dist-tags:

```bash
npm view reshet-components dist-tags
```

## Verify Before Releasing

Build the package:

```bash
npm run build
```

Check what npm will publish:

```bash
npm run pack:check
```

## Bump The Stable Version

Patch release:

```bash
npm version patch
```

Minor release:

```bash
npm version minor
```

Major release:

```bash
npm version major
```

This updates `package.json`, creates the matching git commit, and creates a git tag like `v0.1.3`.

## Push The Exact Stable Version

Push the commit and tag:

```bash
git push --follow-tags
```

The GitHub workflow in [publish-release.yml](./.github/workflows/publish-release.yml) publishes that exact tagged version to npm under `latest`.

## Manual Stable Publish

If you want to publish the current version directly from your machine instead of waiting for GitHub Actions:

```bash
npm publish --tag latest
```

## Quick Stable Flow

```bash
npm pkg get version
npm view reshet-components version
npm run build
npm run pack:check
npm version patch
git push --follow-tags
```

## Notes

- Stable release channel: `latest`
- Canary release channel: `canary`
- Stable releases should use `npm version patch`, `npm version minor`, or `npm version major`
- Canary releases should not be used for official version pushes
