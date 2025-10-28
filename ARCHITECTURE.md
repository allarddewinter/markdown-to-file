# Architecture Documentation

## Overview

Markdown-to-File is a client-side static web application built with vanilla JavaScript and modern web APIs. The architecture prioritizes simplicity, performance, and extensibility.

## Component Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │               index.html (UI Layer)                │     │
│  │  ┌──────────────┐         ┌──────────────┐       │     │
│  │  │   Markdown   │         │   Preview    │       │     │
│  │  │   Textarea   │────────▶│    Pane      │       │     │
│  │  └──────────────┘         └──────────────┘       │     │
│  │  ┌──────────────────────────────────────┐        │     │
│  │  │     Export Controls & Message Log     │        │     │
│  │  └──────────────────────────────────────┘        │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                  │
│  ┌────────────────────────┼────────────────────────────┐    │
│  │              app.js (Controller)                    │    │
│  │   - Event handling                                  │    │
│  │   - State management                                │    │
│  │   - localStorage coordination                       │    │
│  └────────────────────────┬────────────────────────────┘    │
│                           │                                  │
│  ┌────────────┬───────────┴─────────┬──────────────┐        │
│  │            │                     │              │        │
│  ▼            ▼                     ▼              ▼        │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │markdown │  │ export.js│  │localStorage│  │  Themes  │    │
│  │  .js    │  │          │  │  (Data)   │  │   CSS    │    │
│  │         │  │ - PDF    │  │           │  │          │    │
│  │- Parse  │  │ - HTML   │  │- Content  │  │- Styles  │    │
│  │- Render │  │          │  │- Prefs    │  │          │    │
│  │- Purify │  │          │  │           │  │          │    │
│  └────┬────┘  └────┬─────┘  └──────────┘  └──────────┘    │
│       │            │                                         │
│  ┌────┴────────────┴─────────────────────────────────┐     │
│  │          External Libraries (CDN)                  │     │
│  │  - Marked.js (Markdown parsing)                    │     │
│  │  - DOMPurify (XSS sanitization)                    │     │
│  │  - Highlight.js (Syntax highlighting)              │     │
│  │  - html2pdf.js (PDF generation)                    │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Data Flow

### Markdown Rendering Flow

1. **User Input** → User types or pastes markdown in textarea
2. **Event Trigger** → Input event with debounce (300ms)
3. **app.js** → Calls `renderMarkdown()` from markdown.js
4. **markdown.js** → 
   - Parses markdown with Marked.js (GFM mode)
   - Sanitizes HTML with DOMPurify
   - Applies syntax highlighting with Highlight.js
5. **DOM Update** → Preview pane updated with rendered HTML
6. **localStorage** → Content saved automatically

### Export Flow (PDF)

1. **User Action** → Clicks "Export as PDF"
2. **app.js** → Validates input, gathers settings
3. **export.js** → `exportToPDF()` function
   - Retrieves rendered HTML from preview pane
   - Applies selected theme CSS
   - Configures html2pdf.js with:
     - Page size (A4)
     - Orientation (user choice)
     - Margins
     - Page break handling
4. **html2pdf.js** → Generates PDF blob
5. **Browser** → Triggers download

### Export Flow (HTML)

1. **User Action** → Clicks "Export as HTML"
2. **app.js** → Validates input, gathers settings
3. **export.js** → `exportToHTML()` function
   - Creates complete HTML document structure
   - Inlines selected theme CSS
   - Inlines Highlight.js CSS
   - Embeds rendered content
4. **Browser** → Triggers download of standalone HTML file

### localStorage Flow

- **Auto-save**: Debounced saves of markdown content every 300ms
- **Preference save**: Immediate save on theme/orientation change
- **Load on startup**: Restores previous content and settings
- **Storage keys**:
  - `markdown-content`: User's markdown text
  - `selected-theme`: Last selected theme
  - `selected-orientation`: Last selected orientation

## Tech Stack Rationale

### Marked.js
- **Why**: Fast, well-maintained, full GFM support
- **Alternative considered**: markdown-it (more extensible but heavier)
- **Trade-off**: Chose speed and simplicity over plugin ecosystem

### DOMPurify
- **Why**: Industry standard for XSS protection
- **Critical**: Rendering user markdown as HTML requires sanitization
- **Security**: Prevents `<script>` injection and other attacks

### Highlight.js
- **Why**: Automatic language detection, large language support
- **Alternative considered**: Prism.js (lighter but requires language specification)
- **Trade-off**: Chose convenience over minimal bundle size

### html2pdf.js
- **Why**: Pure client-side, jsPDF wrapper with HTML support
- **Alternative considered**: Native browser print (less control), server-side rendering
- **Limitation**: Complex CSS may not render perfectly in PDF

### Vanilla JavaScript
- **Why**: No build step, fast load, easy to understand
- **Alternative considered**: React/Vue (too heavy for this use case)
- **Benefit**: Accessibility for contributors, instant setup

### CDN Delivery
- **Why**: Zero build step, browser caching, fast global delivery
- **Consideration**: Offline use requires cache or local copies
- **Fallback**: Could add local copies if needed

## Module Responsibilities

### app.js (Application Controller)
**Responsibilities:**
- Initialize application on DOM load
- Wire up all event listeners
- Coordinate between modules
- Manage application state
- Handle localStorage operations
- Log errors and warnings to message area

**Key Functions:**
- `init()`: Application bootstrap
- `handleInput()`: Debounced markdown update
- `handleExport()`: Export coordination
- `logMessage()`: User-facing message system
- `saveToLocalStorage()` / `loadFromLocalStorage()`

### markdown.js (Rendering Engine)
**Responsibilities:**
- Configure Marked.js for GFM
- Parse markdown to HTML
- Sanitize HTML output
- Apply syntax highlighting
- Handle rendering errors

**Key Functions:**
- `configureMarked()`: Set up Marked.js options
- `renderMarkdown(text)`: Main rendering pipeline
- `highlightCode()`: Apply Highlight.js
- Error handling for malformed markdown

**Dependencies:**
- Marked.js (CDN)
- DOMPurify (CDN)
- Highlight.js (CDN)

### export.js (Export Engine)
**Responsibilities:**
- PDF generation with theme support
- HTML file generation with embedded styles
- Filename handling (sanitization, timestamps)
- Browser download triggering
- Export error handling

**Key Functions:**
- `exportToPDF(content, options)`: PDF creation
- `exportToHTML(content, options)`: HTML creation
- `generateFilename(base, addTimestamp)`: Filename utility
- `inlineStyles(theme)`: CSS embedding

**Dependencies:**
- html2pdf.js (CDN)
- Theme CSS files

### main.css (Application Styles)
**Responsibilities:**
- Application layout (split-pane)
- UI component styling
- Responsive design
- Base typography

**Does NOT include:**
- Preview content styling (handled by themes)

### Theme CSS Files (Content Styles)
**Responsibilities:**
- Markdown content styling (h1-h6, p, lists, etc.)
- Code block styling
- Table styling
- Consistent typography for export

**Current Themes:**
- `github.css`: GitHub-style markdown
- `dark.css`: Dark mode with high contrast
- `minimal.css`: Clean, minimal design
- `professional.css`: Formal document style

## Extension Guide

### Adding a New Theme

1. **Create CSS file**: `styles/themes/mytheme.css`
   \`\`\`css
   /* Preview container styles */
   .preview-content {
     font-family: /* your choice */;
     color: /* your choice */;
   }
   
   /* Style all markdown elements: h1-h6, p, code, pre, table, etc. */
   \`\`\`

2. **Update index.html**: Add option to theme dropdown
   \`\`\`html
   <option value="mytheme">My Theme</option>
   \`\`\`

3. **Update export.js**: Add theme to CSS loading logic (if needed)

4. **Test**: Verify preview and both export formats

### Adding Export Formats

1. **Create function in export.js**:
   \`\`\`javascript
   export async function exportToNewFormat(content, options) {
     // Your logic here
     return blob;
   }
   \`\`\`

2. **Add UI button** in index.html

3. **Wire up in app.js**:
   \`\`\`javascript
   document.getElementById('new-format-btn').addEventListener('click', () => {
     exportToNewFormat(/* params */);
   });
   \`\`\`

### Adding Markdown Extensions

1. **Update Marked.js config** in markdown.js:
   \`\`\`javascript
   marked.use({
     extensions: [/* custom renderer */]
   });
   \`\`\`

2. **Document behavior** in README

3. **Update tests** if applicable

### Adding localStorage Features

1. **Define key** in app.js constants
2. **Save logic**: Add to relevant event handler
3. **Load logic**: Add to `loadFromLocalStorage()`
4. **Consider**: Migration strategy for schema changes

## Performance Considerations

- **Debouncing**: 300ms debounce on markdown input prevents excessive re-renders
- **DOM Updates**: Single innerHTML update per render (not incremental)
- **localStorage**: Minimal writes, async where possible
- **CSS Loading**: Themes loaded on-demand (could be optimized further)
- **PDF Generation**: Offloaded to html2pdf.js worker (non-blocking when possible)

## Security Considerations

- **XSS Protection**: DOMPurify sanitizes all rendered HTML
- **Content Security Policy**: Consider adding CSP headers for enhanced security
- **localStorage**: No sensitive data stored (only user content and preferences)
- **HTTPS**: Recommended for CDN integrity and security

## Browser Compatibility

- **Target**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **ES6**: Uses modern JavaScript (modules, arrow functions, async/await)
- **APIs**: localStorage, FileReader, Blob, URL.createObjectURL
- **Fallbacks**: None currently implemented (could add for older browsers)

## Future Enhancements

- Markdown syntax toolbar (bold, italic, etc.)
- Template system for documents
- Multiple document tabs
- Drag-and-drop file upload
- DOCX export format
- Print preview mode
- Collaboration features (would require backend)
- Plugin system for custom renderers
- PWA support for offline use
- Internationalization (i18n)

## Testing Strategy

Currently manual testing. Recommended additions:
- Unit tests for markdown.js (Jest)
- Unit tests for export.js
- Integration tests for full workflows
- Visual regression tests for themes
- Cross-browser testing (BrowserStack)

## Deployment

### GitHub Pages
1. Push to `main` branch
2. Enable GitHub Pages in repository settings
3. Select source: `main` branch, root directory
4. Access at: `https://username.github.io/markdown-to-file/`

### Other Static Hosts
Compatible with:
- Netlify (drag-and-drop deploy)
- Vercel
- Cloudflare Pages
- Any static file server

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.
