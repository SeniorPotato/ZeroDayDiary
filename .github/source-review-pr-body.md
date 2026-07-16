Automated monitoring run completed and passed validation.

Safeguards applied:
- source discovery and extraction run inside repository scripts
- generated markdown must pass structural validation before any overwrite
- AI revisions fail closed on malformed frontmatter/body
- Astro build must pass before this PR is created
- changes are proposed as a PR and auto-merged after required checks pass

Review focus:
- optional spot-check of candidate quality and editorial fit
- optional spot-check that generated posts read cleanly
- intervene only if the automated checks or generated content look wrong
