# Markdown-to-File

A client-side static website that converts markdown (including tables and code blocks from LLM outputs) into downloadable PDF or self-contained HTML files.

## ✨ Features

- **Live Preview**: Real-time markdown rendering with GitHub Flavored Markdown (GFM) support
- **Syntax Highlighting**: Code blocks with automatic language detection and highlighting
- **Multiple Themes**: Choose from GitHub, Dark, Minimal, Professional, or the hilarious "Life of Brian" style
- **PDF Export**: Generate clean, paginated PDFs with proper formatting
- **HTML Export**: Create self-contained HTML files with embedded styles
- **Auto-Save**: Automatic localStorage persistence of your markdown content
- **File Upload**: Load markdown files directly from your computer
- **Timestamp Support**: Optionally append timestamps to exported filenames
- **XSS Protection**: DOMPurify sanitization for safe rendering
- **No Server Required**: 100% client-side, works offline after initial load

## 🚀 Usage

### Online
Visit the live demo: [https://allarddewinter.github.io/markdown-to-file](https://allarddewinter.github.io/markdown-to-file)

### Local
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start writing markdown!

### Basic Workflow
1. **Write**: Paste or type markdown in the left pane
2. **Preview**: See live-rendered output on the right
3. **Style**: Select a theme from the dropdown
4. **Export**: Choose PDF or HTML and click the export button

### Features Guide

#### Markdown Input
- Paste markdown directly into the left textarea
- Click "Upload Markdown File" to load a `.md` file
- Click "Clear" to reset the editor
- Content auto-saves to localStorage

#### Export Options
- **Filename**: Enter your desired filename (without extension)
- **Add Timestamp**: Append current date/time to filename
- **Theme**: Select visual style for export
- **Orientation**: Choose Portrait or Landscape for PDF
- **PDF**: Creates a paginated, printable document
- **HTML**: Creates a standalone HTML file with embedded styles

#### Supported Markdown

This tool supports full GitHub Flavored Markdown (GFM):

- Headers (# through ######)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- Links and images
- Code blocks with syntax highlighting
- Inline `code`
- Tables
- Blockquotes
- Horizontal rules
- Task lists
- Strikethrough

## 📋 Examples

### Code Blocks
\`\`\`javascript
function hello() {
  console.log("Markdown with syntax highlighting!");
}
\`\`\`

### Tables
| Feature | Supported |
|---------|-----------|
| Tables  | ✅        |
| Code    | ✅        |
| Export  | ✅        |

## 🛠️ Technology Stack

- **Marked.js**: Fast markdown parser with GFM support
- **DOMPurify**: XSS protection for safe HTML rendering
- **Highlight.js**: Syntax highlighting for code blocks
- **html2pdf.js**: Client-side PDF generation
- **Vanilla JavaScript**: No heavy frameworks, just clean ES6+

## 📦 Installation for Development

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/allarddewinter/markdown-to-file.git
   cd markdown-to-file
   \`\`\`

2. Open `index.html` in your browser or use a local server:
   \`\`\`bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   \`\`\`

3. Navigate to `http://localhost:8000`

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 Project Structure

\`\`\`
markdown-to-file/
├── index.html          # Main application page
├── app.js             # Application controller
├── markdown.js        # Markdown rendering logic
├── export.js          # PDF/HTML export functionality
├── main.css          # Main application styles
├── styles/
│   └── themes/        # Theme stylesheets
│       ├── github.css
│       ├── dark.css
│       ├── minimal.css
│       ├── professional.css
│       └── python.css       # "Life of Brian" theme - Anachronistic Elegance
├── README.md          # This file
├── ARCHITECTURE.md    # Technical documentation
├── CONTRIBUTING.md    # Contribution guidelines
├── THEME_GUIDE.md     # Life of Brian theme documentation
└── TODO.md           # Development progress tracker
\`\`\`

## 🔗 Links

- [Live Demo](https://allarddewinter.github.io/markdown-to-file)
- [GitHub Repository](https://github.com/allarddewinter/markdown-to-file)
- [Documentation](ARCHITECTURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Issue Tracker](https://github.com/allarddewinter/markdown-to-file/issues)

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🙏 Acknowledgments

- Marked.js team for excellent markdown parsing
- Highlight.js for syntax highlighting
- DOMPurify for security
- html2pdf.js for PDF generation

---

**Note**: This is a client-side only application. All processing happens in your browser, and no data is sent to any server.
