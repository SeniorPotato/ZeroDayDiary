# Archived monitoring scripts

This directory contains one-off monitoring maintenance utilities that are no longer part of the active automation surface.

## Archived utilities

- `migrate-posts-to-new-template.mjs` migrated March 2026 blog posts from older section headings into the newer article template.
- `polish-migrated-posts.mjs` applied follow-up copy edits to the same March 2026 migration set.

These scripts are retained only as historical references for how prior content migrations were performed. Do not wire them into npm scripts or GitHub Actions without first reviewing their hard-coded paths, target file lists, and mutation behavior.
