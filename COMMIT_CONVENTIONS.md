# Commit Conventions

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This document serves as a reference for AI assistants and contributors to ensure consistent commit formatting.

## Format Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Required Types

### Primary Types

- **`feat`**: A new feature for the user
- **`fix`**: A bug fix for the user

### Additional Types (Recommended)

- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, missing semicolons, etc.)
- **`refactor`**: Code changes that neither fix a bug nor add a feature
- **`perf`**: Performance improvements
- **`test`**: Adding or updating tests
- **`build`**: Changes to build system or external dependencies
- **`ci`**: Changes to CI configuration files and scripts
- **`chore`**: Other changes that don't modify src or test files
- **`revert`**: Reverts a previous commit

## Scopes (Optional)

Scopes should represent the area of the codebase being modified. For this Next.js project, common scopes might include:

- **`ui`**: User interface components
- **`api`**: API routes or backend logic
- **`auth`**: Authentication/authorization
- **`db`**: Database related changes
- **`config`**: Configuration files
- **`deps`**: Dependencies
- **`casino`**: Casino page/functionality
- **`reports`**: Reports page/functionality
- **`school`**: School page/functionality
- **`settings`**: Settings page/functionality

## Breaking Changes

- Add `!` after the type/scope: `feat!:` or `feat(api)!:`
- Or include `BREAKING CHANGE:` in the footer

## Examples

### Basic Examples

```bash
feat(ui): add loading spinner to casino page
fix(api): resolve user authentication timeout
docs: update README with setup instructions
style: format code according to prettier rules
refactor(casino): extract slot machine logic into separate hook
```

### With Body

```bash
feat(reports): add monthly revenue analytics

Implement comprehensive reporting dashboard with:
- Monthly revenue charts
- User engagement metrics
- Performance indicators

Closes #42
```

### Breaking Changes

```bash
feat(api)!: migrate to new authentication system

BREAKING CHANGE: API endpoints now require Bearer token instead of session cookies
```

### Multiple Changes

```bash
fix(ui): resolve mobile responsiveness issues

- Fix header layout on small screens
- Adjust button spacing on casino page
- Improve navigation menu accessibility

Fixes #23, #45, #67
```

## AI Assistant Guidelines

When creating commits for this project:

1. **Always use the conventional format** with appropriate type and optional scope
2. **Keep the description under 72 characters** for the first line
3. **Use present tense** ("add feature" not "added feature")
4. **Be specific and descriptive** about what changed
5. **Include scope when applicable** to provide context
6. **Reference issues/PRs** in the body or footer when relevant
7. **Use breaking change indicators** when API or functionality changes affect existing usage

### Preferred Patterns for This Project

- Use `feat(ui):` for new user-facing components or pages
- Use `feat(api):` for new backend functionality
- Use `fix(ui):` for visual or interaction bug fixes
- Use `fix(api):` for backend bug fixes
- Use appropriate page scopes: `casino`, `reports`, `school`, `settings`
- Include issue references: `Fixes #123` or `Closes #456`

## Tools Integration

This format enables:

- Automatic changelog generation
- Semantic version bumping
- Better commit history navigation
- Integration with CI/CD pipelines
- Enhanced collaboration and code review

## Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitizen CLI](https://github.com/commitizen/cz-cli) - Interactive commit tool
- [Commitlint](https://commitlint.js.org/) - Lint commit messages
