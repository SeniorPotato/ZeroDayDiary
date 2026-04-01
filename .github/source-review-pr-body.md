Automated monitoring run completed and passed validation.

Safeguards applied:
- source discovery and extraction run inside repository scripts
- generated markdown must pass structural validation before any overwrite
- AI revisions fail closed on malformed frontmatter/body
- Astro build must pass before this PR is created
- changes are proposed as a PR for review instead of pushing directly to main

Review focus:
- confirm candidate quality and editorial fit
- verify generated posts read cleanly
- merge only after normal repository review
