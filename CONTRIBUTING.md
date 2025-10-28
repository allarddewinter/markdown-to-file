# Contributing to Markdown-to-File

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A text editor (VS Code recommended)
- Basic knowledge of HTML, CSS, and JavaScript
- (Optional) A local web server for testing

### Initial Setup

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR-USERNAME/markdown-to-file.git
     cd markdown-to-file
     ```

2. **Set up the development environment**
   - No build step required! Just open `index.html` in your browser
   - Or use a local server for better testing:
     \`\`\`bash
     # Python 3
     python -m http.server 8000
     
     # Node.js
     npx serve
     
     # PHP
     php -S localhost:8000
     \`\`\`

3. **Open the application**
   - Navigate to `http://localhost:8000` (if using a server)
   - Or open `index.html` directly in your browser

## 📝 Development Workflow

### Making Changes

1. **Create a branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   \`\`\`

2. **Make your changes**
   - Follow the coding standards (see below)
   - Add JSDoc comments to new functions
   - Test your changes thoroughly

3. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in export"
   \`\`\`

4. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

5. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template (see below)

## 📐 Coding Standards

### JavaScript

#### Style Guide
- Use ES6+ syntax (const/let, arrow functions, template literals)
- Use 2-space indentation
- Use semicolons
- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_SNAKE_CASE for constants

#### Example
\`\`\`javascript
/**
 * Renders markdown text to sanitized HTML
 * @param {string} markdownText - The markdown source to render
 * @param {Object} options - Rendering options
 * @param {boolean} options.sanitize - Whether to sanitize HTML (default: true)
 * @returns {string} Sanitized HTML output
 * @throws {Error} If markdown parsing fails
 */
function renderMarkdown(markdownText, options = {}) {
  const { sanitize = true } = options;
  
  try {
    const rawHtml = marked.parse(markdownText);
    return sanitize ? DOMPurify.sanitize(rawHtml) : rawHtml;
  } catch (error) {
    console.error('Markdown rendering failed:', error);
    throw new Error('Failed to render markdown');
  }
}
\`\`\`

### JSDoc Requirements

All functions must have JSDoc comments including:
- Description of what the function does
- `@param` for each parameter (type and description)
- `@returns` for return value
- `@throws` for any thrown errors
- Design rationale or important notes when relevant

### HTML

- Use semantic HTML5 elements
- Use meaningful IDs and classes
- Include ARIA labels for accessibility
- Keep inline styles minimal (prefer CSS classes)

### CSS

- Use BEM naming convention where appropriate
- Group related properties
- Comment complex selectors
- Use CSS custom properties (variables) for themes
- Mobile-first responsive design

#### Example
\`\`\`css
/* Preview pane - displays rendered markdown */
.preview-pane {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: var(--preview-bg, #ffffff);
}

/* Preview content wrapper - applies theme styles */
.preview-content {
  max-width: 800px;
  margin: 0 auto;
}
\`\`\`

### File Organization

\`\`\`
markdown-to-file/
├── index.html              # Main HTML (UI structure only)
├── app.js                 # Application controller (event handling, coordination)
├── markdown.js            # Markdown rendering logic
├── export.js              # Export functionality (PDF, HTML)
├── main.css              # Application layout and UI styles
├── styles/
│   └── themes/            # Content styling themes
│       ├── github.css
│       ├── dark.css
│       ├── minimal.css
│       └── professional.css
└── docs/
    ├── README.md
    ├── ARCHITECTURE.md
    ├── CONTRIBUTING.md
    └── TODO.md
\`\`\`

## 🎨 Adding a New Theme

Themes style the markdown preview and export output. Here's how to add one:

### 1. Create the CSS file

Create `styles/themes/yourtheme.css`:

\`\`\`css
/**
 * Your Theme Name
 * Description: Brief description of the theme
 * Author: Your Name
 */

.preview-content {
  font-family: 'Your Font', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333333;
  background-color: #ffffff;
}

/* Headers */
.preview-content h1 {
  font-size: 2.5em;
  margin-top: 1em;
  margin-bottom: 0.5em;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 0.3em;
}

/* Add styles for h2-h6, p, a, code, pre, table, ul, ol, blockquote, etc. */

/* Code blocks */
.preview-content pre {
  background-color: #f6f8fa;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
}

/* Tables */
.preview-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

/* ... more styles ... */
\`\`\`

### 2. Update the HTML

Add your theme to the dropdown in `index.html`:

\`\`\`html
<select id="theme-select">
  <option value="github">GitHub</option>
  <option value="dark">Dark</option>
  <option value="minimal">Minimal</option>
  <option value="professional">Professional</option>
  <option value="yourtheme">Your Theme Name</option>
</select>
\`\`\`

### 3. Test your theme

- Select your theme in the preview
- Test with various markdown elements:
  - Headers (h1-h6)
  - Paragraphs and text formatting
  - Lists (ordered and unordered)
  - Code blocks with different languages
  - Tables
  - Blockquotes
  - Links and images
- Export to PDF and HTML to verify styling

### 4. Document your theme

Add a comment block at the top of your CSS file with:
- Theme name
- Description/use case
- Author
- Any special considerations

## 🔧 Adding New Features

### Example: Adding a New Export Format

1. **Plan the feature**
   - What format? (e.g., DOCX, RTF)
   - Required libraries?
   - User interface changes?

2. **Update export.js**

\`\`\`javascript
/**
 * Exports markdown content to DOCX format
 * @param {string} content - The rendered HTML content
 * @param {Object} options - Export options
 * @param {string} options.filename - Output filename (without extension)
 * @param {string} options.theme - Selected theme name
 * @returns {Promise<Blob>} The generated DOCX blob
 * @throws {Error} If DOCX generation fails
 */
export async function exportToDOCX(content, options) {
  try {
    // Your implementation here
    // 1. Convert HTML to DOCX format
    // 2. Apply theme styling
    // 3. Return blob
  } catch (error) {
    console.error('DOCX export failed:', error);
    throw new Error('Failed to export DOCX');
  }
}
\`\`\`

3. **Update UI** (index.html)

\`\`\`html
<button id="export-docx" class="export-btn">Export as DOCX</button>
\`\`\`

4. **Wire up event** (app.js)

\`\`\`javascript
document.getElementById('export-docx').addEventListener('click', async () => {
  try {
    const content = document.getElementById('preview-pane').innerHTML;
    const filename = document.getElementById('filename-input').value;
    const theme = document.getElementById('theme-select').value;
    
    await exportToDOCX(content, { filename, theme });
    logMessage('DOCX exported successfully!', 'success');
  } catch (error) {
    logMessage(`Export failed: ${error.message}`, 'error');
  }
});
\`\`\`

5. **Update documentation**
   - Add to README.md features list
   - Update ARCHITECTURE.md if needed
   - Add usage instructions

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Markdown rendering
  - [ ] Headers (all levels)
  - [ ] Text formatting (bold, italic, strikethrough)
  - [ ] Lists (ordered, unordered, nested)
  - [ ] Code blocks (multiple languages)
  - [ ] Inline code
  - [ ] Tables
  - [ ] Blockquotes
  - [ ] Links
  - [ ] Images (if applicable)
  - [ ] Horizontal rules
  - [ ] Task lists

- [ ] UI functionality
  - [ ] Clear button
  - [ ] File upload
  - [ ] Theme selection
  - [ ] Orientation selection
  - [ ] Filename input
  - [ ] Timestamp button

- [ ] Export features
  - [ ] PDF export (all themes)
  - [ ] HTML export (all themes)
  - [ ] Portrait orientation
  - [ ] Landscape orientation
  - [ ] Timestamp in filename

- [ ] Persistence
  - [ ] Markdown content saves
  - [ ] Theme preference saves
  - [ ] Content restores on reload

- [ ] Error handling
  - [ ] Invalid markdown
  - [ ] Empty filename
  - [ ] Export failures
  - [ ] Messages appear in log

- [ ] Browser compatibility
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

### Automated Testing (Future)

We plan to add:
- Unit tests with Jest
- Integration tests
- Visual regression tests
- CI/CD with GitHub Actions

## 📋 Pull Request Guidelines

### PR Title Format

Use conventional commit format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`
- `chore: update dependencies`

### PR Description Template

\`\`\`markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing Done
- [ ] Manual testing completed
- [ ] All features work as expected
- [ ] No console errors
- [ ] Tested in multiple browsers

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] JSDoc comments added
- [ ] Documentation updated
- [ ] No breaking changes (or documented if necessary)
\`\`\`

## 🐛 Reporting Bugs

### Bug Report Template

\`\`\`markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop]

## Screenshots
[If applicable]

## Additional Context
Any other relevant information
\`\`\`

## 💡 Feature Requests

We welcome feature requests! Please:
1. Check existing issues first
2. Describe the feature clearly
3. Explain the use case
4. Consider implementation complexity

## 🎯 Good First Issues

Looking to contribute but not sure where to start? Look for issues labeled:
- `good first issue`
- `help wanted`
- `documentation`

## ✅ Code Review Process

1. Maintainer reviews PR
2. Feedback provided (if needed)
3. You address feedback
4. Maintainer approves
5. PR merged!

We aim to review PRs within 3-5 days.

## 📞 Getting Help

- Open an issue for bugs or questions
- Check existing documentation
- Review closed issues for similar problems

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue and we'll help you get started.
