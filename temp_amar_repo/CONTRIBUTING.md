# Contributing to AMAR

Thank you for your interest in contributing to AMAR! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/amar.git
   cd amar
   ```
3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```

## 🔧 Development Setup

### Prerequisites
- Python 3.8+
- Git
- Gemini API key

### Installation
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run tests
python -m pytest tests/
```

## 📝 How to Contribute

### Reporting Bugs
- Use GitHub Issues
- Include detailed description
- Provide steps to reproduce
- Include system information
- Add relevant logs/screenshots

### Suggesting Features
- Use GitHub Issues with "enhancement" label
- Describe the feature clearly
- Explain use cases
- Discuss implementation approach

### Code Contributions

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation
   - Keep commits focused and clear

3. **Test your changes**
   ```bash
   python -m pytest tests/
   python evaluation.py
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe your changes
   - Reference related issues
   - Include test results

## 📋 Code Style

### Python
- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions
- Keep functions focused and small
- Use type hints where appropriate

### Example
```python
def calculate_confidence(scores: List[float]) -> float:
    """
    Calculate confidence score from similarity scores.
    
    Args:
        scores: List of similarity scores
        
    Returns:
        Confidence score between 0 and 1
    """
    if not scores:
        return 0.0
    return min(np.mean(scores) * 1.2, 0.95)
```

### Documentation
- Update README.md for major changes
- Add/update docs in `docs/` folder
- Include code examples
- Keep documentation clear and concise

## 🧪 Testing

### Running Tests
```bash
# All tests
python -m pytest tests/

# Specific test
python -m pytest tests/test_pipeline.py

# With coverage
python -m pytest --cov=. tests/
```

### Writing Tests
- Add tests for new features
- Test edge cases
- Use descriptive test names
- Keep tests independent

## 📚 Documentation

### Adding Documentation
1. Create markdown file in `docs/`
2. Follow existing format
3. Update `docs/INDEX.md`
4. Link from README.md if relevant

### Documentation Style
- Use clear headings
- Include code examples
- Add screenshots if helpful
- Keep it concise

## 🎯 Areas for Contribution

### High Priority
- [ ] Additional LLM integrations (OpenAI, Anthropic)
- [ ] More knowledge base documents
- [ ] Performance optimizations
- [ ] Additional export formats
- [ ] Better error handling

### Medium Priority
- [ ] Web UI for interactive queries
- [ ] API server implementation
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] More comprehensive tests

### Low Priority
- [ ] Additional language support
- [ ] Plugin system
- [ ] Advanced analytics
- [ ] Custom embedding models

## 🔄 Pull Request Process

1. **Before submitting**
   - Run all tests
   - Update documentation
   - Check code style
   - Rebase on main branch

2. **PR Description**
   - Clear title
   - Detailed description
   - List of changes
   - Related issues
   - Test results

3. **Review Process**
   - Maintainers will review
   - Address feedback
   - Keep discussion focused
   - Be patient and respectful

4. **After Merge**
   - Delete your branch
   - Update your fork
   - Celebrate! 🎉

## 📜 Commit Message Guidelines

### Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```bash
feat(rag): add support for custom embeddings
fix(export): handle empty query results
docs(readme): update installation instructions
```

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing private information
- Unprofessional conduct

## 📞 Getting Help

- **Documentation**: Check `docs/` folder
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions
- **Questions**: Open an issue with "question" label

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AMAR! 🚀
