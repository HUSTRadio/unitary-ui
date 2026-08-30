# Git policy

Inspect the actual refs, changed paths, and bounded diff supplied by the runner before deciding whether documentation is affected.

Never modify HEAD, refs, the Git index, repository configuration, or hook configuration. Stop with an explicit blocker when the repository scope or pushed ref range cannot be verified.
