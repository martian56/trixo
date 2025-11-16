# Contributing to Trixo

Thank you for your interest in contributing to Trixo! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/trixo.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Build: `npm run build`
7. Test your changes: `npm run dev`

## Development Workflow

### Adding a New Language/Framework

1. Add enum values in `src/types/index.ts`
2. Add configuration in `src/config/languages.ts`
3. Create generator class extending `BaseGenerator` in `src/generators/`
4. Register generator in `src/generators/registry.ts`
5. Create template files in `templates/`

### Adding New Options

1. Add option definition in `src/config/python-options.ts` (or create language-specific config)
2. Implement option generation in the generator class
3. Update documentation

## Code Style

- Use TypeScript with strict mode
- Follow existing code patterns
- Add comments for complex logic
- Keep functions focused and modular

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add Django generator`
- `fix: resolve template path issue`
- `docs: update README with new features`

## Pull Requests

1. Ensure your code builds: `npm run build`
2. Test your changes thoroughly
3. Update documentation if needed
4. Create a clear PR description
5. Reference any related issues

## Questions?

Open an issue for questions or discussions about contributions.

