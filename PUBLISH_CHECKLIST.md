# SDK Package Publication Checklist

Final verification checklist for publishing `@zk-payroll/sdk` to npm.
Run through every item before `npm publish`. For the full release process, see [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).

---

## 1. Version

- [ ] `package.json` version bumped per [semver](https://semver.org/)
- [ ] Version matches the annotated git tag (`v{major}.{minor}.{patch}`)
- [ ] No uncommitted changes since version bump (`git status` is clean)
- [ ] Tag pushed: `git push origin v{version}`

**Common mistakes**
- Bumping version after tagging (tag and commit must match)
- Tag format differs from convention (use `v1.2.3`)
- Forgot to push the tag

---

## 2. Tests

- [ ] `npm run typecheck` — zero type errors
- [ ] `npm run lint` — no lint violations
- [ ] `npm test` — all unit tests pass
- [ ] `npm run test:smoke` — smoke tests pass
- [ ] `npm run test:coverage` — coverage threshold met (if configured)

All checks above are enforced by [CI workflow](.github/workflows/ci.yml).
Confirm the release branch/PR is green on GitHub Actions before proceeding.

**Common mistakes**
- Pushing with known failing tests
- `test.only` or `test.skip` left in from debugging
- Coverage dropped but unreviewed

---

## 3. Documentation

- [ ] **CHANGELOG** — a versioned entry exists following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/):
  - `Added`, `Changed`, `Fixed`, `Removed`, `Security` sections as needed
  - All links reference real issues or PRs
  - `## [Unreleased]` section is present above the new version entry
- [ ] **README** — public API, installation, and usage instructions are up to date
- [ ] **JSDoc / TSDoc** — every public export in `lib/zk/` has a current doc comment
- [ ] **`docs/` files** — updated for any behaviour changes in this release

**Common mistakes**
- New exports are undocumented
- README references removed features or old parameter names
- CHANGELOG describes changes in the wrong version section

---

## 4. Artifacts

- [ ] `npm run build` — production build completes without warnings
- [ ] **Package content verified** — reduce surprises by inspecting what ships:

  ```bash
  npm pack --dry-run
  ```

  Confirm the output includes only:
  - Compiled JavaScript/TypeScript declaration files
  - `package.json`
  - README, LICENSE, CHANGELOG
  - **Excludes**: `__tests__/`, `node_modules/`, `.next/`, `.env*`, source maps (unless intended)
- [ ] `.npmignore` or `"files"` field in `package.json` is correctly configured
- [ ] `"private": true` is removed (or set to `false`) in `package.json`

**Common mistakes**
- `.env` or secrets baked into the build output
- Large unnecessary files included (`node_modules`, `.next`, `coverage`)
- Build succeeds locally but fails in CI (run CI checks as final confirmation)

---

## 5. Integrities

- [ ] **Dependencies** — `npm ci` produces a clean install; no unexpected dependency changes
- [ ] **`package.json`** — `"name"`, `"version"`, `"description"`, `"main"` / `"exports"`, `"types"` are correct
- [ ] **Engines** — `"engines"` field (if set) matches supported Node.js versions
- [ ] **License** — SPDX identifier in `package.json` matches `LICENSE` file

---

## 6. Publishing

- [ ] Logged into the correct npm account:

  ```bash
  npm whoami
  ```

- [ ] Pre-publish dry run — no errors:

  ```bash
  npm publish --dry-run
  ```

- [ ] Actual publish:

  ```bash
  npm publish
  ```

- [ ] **Post-publish smoke test** — install the published package in a clean directory:

  ```bash
  cd /tmp && mkdir smoke-test && cd smoke-test
  npm init -y
  npm install @zk-payroll/sdk@latest
  node -e "require('@zk-payroll/sdk')"
  ```

- [ ] **GitHub Release created**:

  ```bash
  gh release create v{version} --generate-notes
  ```

- [ ] **Vercel deployment** (if applicable): merge to `main` — [deploy workflow](.github/workflows/deploy.yml) handles it automatically

**Common mistakes**
- Publishing from the wrong npm account (check `npm whoami`)
- Skipping the dry run and discovering file issues after publish
- Forgetting to create the GitHub Release

---

## Quick Reference: npm Workflow

```
Bump version  →  Update CHANGELOG  →  Tag & push  →
Run CI checks →  Build & pack verify →  npm publish →
Create GitHub Release →  Merge to main (Vercel deploy)
```

---

*See [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) for the complete release process,
[CI workflow](.github/workflows/ci.yml) for automated checks, and
[deploy workflow](.github/workflows/deploy.yml) for Vercel deployment.*

*Report issues with this checklist at https://github.com/zkpayroll/zk-payroll-dashboard/issues*
