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
- **JavaScript (Node.js)** with ES6+ features
- **ESLint** for code quality
- Consistent naming conventions and file organization

Before submitting:
```bash
# Install dependencies
npm install

# Test the script
npm start
```

### Coding Standards

1. **Service-based architecture**: Follow the existing pattern with services in `src/services/`
2. **Error handling**: All errors must include unique error codes (format: `(1000XXX)`)
3. **Validation**: Use validation utilities for inputs
4. **Naming**: Use clear, descriptive names for variables, functions, and classes
5. **Enums**: Use enums for status values and constants
6. **Models**: Define data models in `src/core/models/`

### Adding New Features

When adding new features:
1. Create appropriate models in `src/core/models/`
2. Add service logic in `src/services/`
3. Update enums in `src/core/enums/` if needed
4. Update configurations in `src/configurations/` if needed
5. Add error codes following the existing pattern
6. Test thoroughly in both development and production modes

### Project Structure

```
src/
├── configurations/    # Configuration files (ignore lists, etc.)
├── core/
│   ├── enums/        # Status enums and constants
│   └── models/       # Data models
├── logics/           # Business logic
├── scripts/          # Entry point scripts
├── services/         # Service layer
├── settings/         # Application settings
├── tests/            # Test files
└── utils/            # Utility functions
```

### Configuration Guidelines

When modifying settings:
1. All settings should be in `src/settings/settings.js`
2. Use descriptive names with proper categories (GENERAL, FLAG, LOG, etc.)
3. Add comments explaining the purpose of each setting
4. Maintain backward compatibility when possible

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

* Or Assayag <orassayag@gmail.com>
* GitHub: https://github.com/orassayag
* StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
* LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
