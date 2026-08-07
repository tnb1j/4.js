# Upstream Provenance

## Source

4.js began as a derivative of:

- Project: Three.js
- Release line: r185
- Package version: `0.185.1`
- Upstream repository: `https://github.com/mrdoob/three.js`
- License: MIT

The extracted source snapshot does not contain Git metadata, so an exact
upstream commit hash cannot be verified from this directory alone.

## Attribution

The original Three.js copyright notice and MIT permission notice are preserved
in [LICENSE](LICENSE). Additional derivative-project attribution is recorded in
[NOTICE](NOTICE). These files must accompany redistributed copies or
substantial portions of the software.

## Independence

4.js is maintained as an independent fork. Names, package identifiers, issue
trackers, release channels, security contacts, and support policies for 4.js
must not imply endorsement by or operational responsibility from the Three.js
project.

## Upstream Sync Policy

Future upstream changes should be integrated as reviewable batches:

1. Record the upstream release and commit.
2. Import upstream changes without mixing unrelated 4.js feature work.
3. Resolve identity-sensitive files through the dual-build compatibility layer.
4. Run native and legacy entry-point parity checks.
5. Record behavior changes in [CHANGELOG.4JS.md](CHANGELOG.4JS.md).
