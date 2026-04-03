# Contributing to Surge

Thanks for your interest in contributing to Surge! Here is how to get started.

## How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make your changes
4. Commit with a descriptive message
5. Push to your fork
6. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/surge.git
cd surge

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Set up the database
npx prisma generate
npx prisma db push

# Seed demo data (optional)
npx prisma db seed

# Start the dev server
npm run dev
```

## Code Style

- **TypeScript** - All new code should be written in TypeScript
- **Tailwind CSS** - Use Tailwind utility classes for styling
- **Follow existing patterns** - Look at how similar features are implemented before adding new ones
- **No unused imports** - Clean up imports before committing

## Pull Request Guidelines

- Use a descriptive title that summarizes the change
- Explain what the PR does and why
- Link any related GitHub issues
- Keep PRs focused - one feature or fix per PR
- Make sure the build passes before requesting review

## Bug Reports

Open a GitHub issue with:

- A clear description of the bug
- Steps to reproduce it
- Expected behavior vs actual behavior
- Your environment (OS, Node version, browser)
- Screenshots if applicable

## Feature Requests

Open a GitHub issue to discuss the feature before building it. This helps avoid duplicate work and ensures the feature fits the project direction.

## Questions

If you have questions about the codebase or how to implement something, open a GitHub Discussion or ask in the issue tracker.
