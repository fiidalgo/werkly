# Git Workflow & Best Practices

## Branch Strategy

We use a simplified Git Flow with feature branches.

### Branch Naming

- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `refactor/what-changed` - Code refactoring
- `docs/what-updated` - Documentation updates

**Examples**:
- `feat/chat-history`
- `fix/login-redirect-loop`
- `refactor/api-error-handling`
- `docs/update-readme`

### Branch Lifecycle

```bash
# Create branch from main
git checkout main
git pull origin main
git checkout -b feat/my-feature

# Make changes
git add .
git commit -m "short commit message"

# Push to remote
git push origin feat/my-feature

# Create PR on GitHub
# After approval and merge, delete branch
git checkout main
git pull origin main
git branch -d feat/my-feature
```

## Commit Messages

### Format

**Short, one-line format** (no bullet lists):

```
add user authentication with supabase
fix dashboard sidebar collapse animation
update database schema for chat history
refactor text extraction to use async/await
```

### Good Examples

✅ `add employee management page`
✅ `fix type errors in api routes`
✅ `update readme with setup instructions`
✅ `remove unused dependencies`

### Bad Examples

❌ `feat: Add employee management feature with full CRUD` (too verbose)
❌ `Fixed stuff` (too vague)
❌ `WIP` (never commit WIP)
❌ `asdf` (meaningless)

### Commit Frequency

**Commit often** - each commit should be small and focused:

- ✅ One feature/fix per commit
- ✅ All tests pass
- ✅ Code compiles
- ✅ Related changes grouped

**Bad commits**:
- ❌ 500+ lines changed
- ❌ Multiple unrelated changes
- ❌ Broken code
- ❌ "Fix" commits immediately after

## Pull Requests

### PR Title

Same format as commit messages:

```
add proactive suggestions feature
fix vector search threshold issue
```

### PR Description

Keep it concise:

```markdown
## Summary
- Added suggestions API endpoint
- Updated dashboard to show suggestions
- Created test documents

## Test Plan
- [x] Upload documents
- [x] Verify suggestions appear
- [x] Test different user roles
- [ ] QA team review
```

### PR Size

**Ideal**: 100-300 lines changed
**Maximum**: 500 lines

If larger, break into multiple PRs.

### Review Process

1. **Author**: Create PR, request reviewers
2. **Reviewer**: Review within 24 hours
3. **Author**: Address feedback
4. **Reviewer**: Approve or request changes
5. **Author**: Merge after approval
6. **Author**: Delete branch

### Required Approvals

- **Frontend changes**: 1 frontend engineer
- **Backend changes**: 1 backend engineer
- **Database migrations**: 1 backend engineer + CTO
- **Security changes**: Security team review

## Code Review Guidelines

### As a Reviewer

**Look for**:
- Logic errors
- Security issues
- Performance problems
- Code clarity
- Test coverage
- Documentation updates

**Don't nitpick**:
- Minor style differences (linter handles this)
- Personal preferences
- "I would have done it differently" (unless there's a real issue)

**Be constructive**:
- ✅ "Consider using Promise.all here for better performance"
- ❌ "This is wrong"

### As an Author

**Before requesting review**:
- [ ] Code compiles (`npm run build`)
- [ ] Tests pass (if applicable)
- [ ] Linter passes
- [ ] Self-review (read your own diff)
- [ ] Screenshots for UI changes

**Responding to feedback**:
- Reply to all comments
- Push changes or explain why not
- Re-request review after changes

## Merge Strategy

We use **Squash and Merge** to keep main branch clean.

### Why Squash?

- Clean history (one commit per PR)
- Easy to revert features
- Easier to understand history

### After Merge

- Delete your feature branch (GitHub does this automatically)
- Pull latest main locally: `git pull origin main`

## Handling Merge Conflicts

### Prevention

- Pull main frequently: `git pull origin main`
- Keep PRs small
- Coordinate with team on overlapping work

### Resolution

```bash
# Update your branch with latest main
git checkout feat/my-feature
git pull origin main

# If conflicts, Git will tell you which files
# Open conflicted files, resolve manually
# Look for <<<<<<< HEAD markers

git add <resolved-files>
git commit -m "resolve merge conflicts"
git push origin feat/my-feature
```

## Git Tips & Tricks

### Amend Last Commit

```bash
# Forgot to add a file
git add forgotten-file.ts
git commit --amend --no-edit
git push --force-with-lease
```

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Stash Changes

```bash
# Save work in progress
git stash

# Apply stashed changes later
git stash pop
```

### Cherry-Pick a Commit

```bash
# Apply specific commit to current branch
git cherry-pick <commit-hash>
```

### View Pretty Log

```bash
git log --oneline --graph --all --decorate
```

## Protected Branches

### main

- Cannot push directly
- Requires PR
- Requires 1 approval
- Must pass CI checks (future)

## gitignore

Never commit:
- `.env.local` (secrets!)
- `.next/` (build artifacts)
- `node_modules/` (dependencies)
- `.DS_Store` (macOS files)
- IDE config (`.vscode/`, `.idea/`)

Check `.gitignore` if unsure.

## Common Issues

### "Updates were rejected"

```bash
# Someone else pushed first
git pull --rebase origin feat/my-feature
git push
```

### "Diverged branches"

```bash
# Your local is behind remote
git pull origin feat/my-feature
# Resolve conflicts if any
git push
```

### "Accidentally committed to main"

```bash
# Move commit to feature branch
git branch feat/my-feature
git reset --hard origin/main
git checkout feat/my-feature
```

## Best Practices

1. **Pull before starting work**: `git pull origin main`
2. **Commit atomically**: One logical change per commit
3. **Write clear messages**: Future you will thank you
4. **Review your own diffs**: Catch mistakes early
5. **Don't commit commented code**: Delete it
6. **Don't commit console.logs**: Remove debug statements
7. **Keep PRs focused**: One feature/fix per PR

## Resources

- Git docs: https://git-scm.com/doc
- GitHub guides: https://guides.github.com
- Interactive Git: https://learngitbranching.js.org
- Slack: #engineering

---

**Last Updated**: December 2024
**Maintainer**: Engineering Team
