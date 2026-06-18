# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/spam-revenge/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Error codes (if applicable)
   - Your environment details (OS, Node version)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:

- **TypeScript** with strict type checking
- **ESLint** for code quality
- **Prettier** for code formatting
- **InversifyJS** for dependency injection

Before submitting:

```bash
pnpm format
pnpm lint
pnpm build
pnpm test
```

### Coding Standards

1. **Dependency Injection**: Use @injectable decorators for services
2. **Error handling**: All errors must include unique error codes (see `misc/error_index.txt`)
3. **Logging**: Use structured Logger instead of console.log
4. **Type safety**: Avoid using `any` - define proper types
5. **Domain organization**: Place code in appropriate domain folders (not utils/)
6. **Naming**: Use clear, descriptive names for variables and functions

### Adding New Features

When adding new features:

1. Create appropriate types in `src/types/`
2. Add service logic in `src/services/` with DI
3. Update scripts in `src/scripts/` if needed
4. Add error codes and update `misc/error_index.txt`
5. Test thoroughly with vitest

### Error Code Management

When adding new errors:

1. Use the next available error code from `misc/error_index.txt`
2. Format: `[ERROR-XXXXXXX]` at the start of the error message
3. Document the error in `misc/error_index.txt`

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

- Or Assayag <orassayag@gmail.com>
- GitHub: https://github.com/orassayag
- StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
- LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
