# PR Title Validation

This repository uses a GitHub Action to automatically validate Pull Request titles to ensure they follow a consistent format.

## Required Format

PR titles must follow this pattern:

```
<type>(<scope>): <subject>
```

Where:
- **type**: Must be one of: `feat`, `chore`, or `fix`
- **scope**: Must match the pattern `ABC-NNN` (2+ uppercase letters, hyphen, 1+ numbers)
- **subject**: Must be at least 3 characters long and contain meaningful content

## Valid Examples

✅ `feat(ABC-123): add new feature`
✅ `fix(DEF-456): resolve bug`
✅ `chore(XYZ-789): update dependencies`
✅ `feat(PROJ-1): initial commit`

## Invalid Examples

❌ `feature(ABC-123): ...` - Invalid prefix (use `feat` instead of `feature`)
❌ `feat(abc-123): ...` - Lowercase scope (must be uppercase)
❌ `feat(A-123): ...` - Scope too short (need at least 2 letters)
❌ `feat: missing scope` - Missing required scope
❌ `feat(ABC-123): ab` - Subject too short (minimum 3 characters)
❌ `feat(ABC-123):  ` - Whitespace-only subject

## How It Works

The validation is performed by a GitHub Action that runs automatically when:
- A PR is opened
- A PR title is edited
- A PR is synchronized (new commits pushed)
- A PR is reopened

If the PR title doesn't match the required format, the action will fail and provide feedback on what needs to be corrected.

## Workflow Location

The workflow configuration is located at: `.github/workflows/pr-title-validation.yml`
