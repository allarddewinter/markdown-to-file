/**
 * Export module for HTML generation
 * Handles creation of downloadable files with theme-specific styling
 * @module export
 */

/**
 * ExportManager class
 * Manages HTML export functionality with configurable themes and options
 */
class ExportManager {
    constructor() {
        this.themes = this.loadThemes();
    }

    /**
     * Load theme definitions
     * @returns {Object} - Theme configurations with CSS styles
     *
     * Design decision: Themes are defined in JavaScript for easier maintenance
     * and to ensure consistency between preview and export
     *
     * Extension point: Add new themes by adding entries to this object
     */
    loadThemes() {
        return {
            github: {
                name: 'GitHub',
                css: `
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #24292e;
                        background-color: #ffffff;
                        padding: 2rem;
                        max-width: 980px;
                        margin: 0 auto;
                    }
                    h1, h2 { border-bottom:1px solid #eaecef; padding-bottom: 0.3rem; }
                    h1 { font-size: 2rem; }
                    h2 { font-size: 1.5rem; }
                    h3 { font-size: 1.25rem; }
                    code { background-color: rgba(27,31,35,0.05); padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Consolas', monospace; }
                    pre { background-color: #f6f8fa; padding: 1rem; border-radius: 6px; overflow-x: auto; }
                    pre code { background-color: transparent; padding: 0; }
                    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
                    th, td { border: 1px solid #d1d5da; padding: 0.75rem; text-align: left; }
                    th { background-color: #f6f8fa; font-weight: 600; }
                    tr:nth-child(even) { background-color: #f6f8fa; }
                    blockquote { padding: 0 1rem; color: #586069; border-left: 4px solid #dfe2e5; margin: 1rem 0; }
                    a { color: #0366d6; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                `
            },
            dark: {
                name: 'Dark',
                css: `
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
                        line-height: 1.6;
                        color: #c9d1d9;
                        background-color: #0d1117;
                        padding: 2rem;
                        max-width: 980px;
                        margin: 0 auto;
                    }
                    h1, h2 { border-bottom: 1px solid #21262d; padding-bottom: 0.3rem; color: #f0f6fc; }
                    h1 { font-size: 2rem; }
                    h2 { font-size: 1.5rem; }
                    h3 { font-size: 1.25rem; color: #f0f6fc; }
                    code { background-color: rgba(110,118,129,0.4); padding: 0.2rem 0.4rem; border-radius: 3px; font-family: 'Consolas', monospace; }
                    pre { background-color: #161b22; padding: 1rem; border-radius: 6px; overflow-x: auto; }
                    pre code { background-color: transparent; padding: 0; }
                    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
                    th, td { border: 1px solid #30363d; padding: 0.75rem; text-align: left; }
                    th { background-color: #161b22; font-weight: 600; }
                    tr:nth-child(even) { background-color: #161b22; }
                    blockquote { padding: 0 1rem; color: #8b949e; border-left: 4px solid #30363d; margin: 1rem 0; }
                    a { color: #58a6ff; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                `
            },
            minimal: {
                name: 'Minimal',
                css: `
                    body {
                        font-family: Georgia, serif;
                        line-height: 1.8;
                        color: #333;
                        background-color: #fff;
                        padding: 2rem;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    h1, h2, h3 { margin-top: 2rem; margin-bottom: 1rem; }
                    h1 { font-size: 2.5rem; }
                    h2 { font-size: 2rem; }
                    h3 { font-size: 1.5rem; }
                    code { font-family: 'Courier New', monospace; background-color: #f5f5f5; padding: 0.2rem 0.4rem; }
                    pre { background-color: #f5f5f5; padding: 1rem; overflow-x: auto; border-left: 3px solid #333; }
                    pre code { background-color: transparent; padding: 0; }
                    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
                    th, td { border: 1px solid #ddd; padding: 0.75rem; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f5f5f5; }
                    blockquote { padding: 0 1rem; color: #666; border-left: 3px solid #ddd; margin: 1rem 0; font-style: italic; }
                    a { color: #333; text-decoration: underline; }
                `
            },
            professional: {
                name: 'Professional',
                css: `
                    body {
                        font-family: 'Calibri', Arial, Helvetica, sans-serif;
                        line-height: 1.6;
                        color: #212529;
                        background-color: #fff;
                        padding: 2rem;
                        max-width: 980px;
                        margin: 0 auto;
                    }
                    h1, h2 { padding-bottom: 0.3rem; }
                    h1 { font-size: 2.2rem; color: #0066cc; border-bottom: 3px solid #0066cc; }
                    h2 { font-size: 1.8rem; color: #495057; border-bottom: 2px solid #6c757d; }
                    h3 { font-size: 1.4rem; color: #495057; }
                    h4, h5 { font-size: 1.2rem; color: #495057; font-weight: 700; }
                    p { text-align: justify; margin-bottom: 1rem; }
                    code { font-family: 'Consolas', 'Courier New', monospace; background-color: #f1f3f5; border: 1px solid #dee2e6; padding: 0.2rem 0.5rem; border-radius: 3px; }
                    pre { background-color: #f8f9fa; padding: 1rem; border: 1px solid #dee2e6; border-radius: 4px; overflow-x: auto; }
                    pre code { background-color: transparent; padding: 0; border: 0; }
                    table { border-collapse: collapse; width: 100%; margin: 1rem 0; border: 1px solid #dee2e6; }
                    th, td { border: 1px solid #dee2e6; padding: 10px 15px; text-align: left; }
                    th { background-color: #0066cc; color: #fff; font-weight: 700; }
                    tr:nth-child(even) { background-color: #f8f9fa; }
                    blockquote { padding: 0.8rem 1.5rem; color: #495057; border-left: 5px solid #0066cc; margin: 1rem 0; background-color: #f1f3f5; font-style: italic; }
                    a { color: #0066cc; text-decoration: underline; }
                    a:hover { color: #004499; }
                `
            }
        };
    }

    /**
     * Export content to self-contained HTML
     * @param {string} markdown - The markdown source
     * @param {string} filename - Base filename (without extension)
     * @param {string} themeName - Theme to apply
     * @param {boolean} showFooter - Whether to include footer
     */
    async exportToHTML(markdown, filename, themeName, showFooter = false) {
        try {
            const marked = window.marked;
            const DOMPurify = window.DOMPurify;
            if (!marked || !DOMPurify) {
                throw new Error('Required libraries not loaded');
            }
            const rawHtml = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(rawHtml);
            const htmlContent = this.generateHTMLTemplate(cleanHtml, themeName, filename, showFooter);
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('HTML export error:', error);
            throw new Error('Failed to generate HTML: ' + error.message);
        }
    }

    /**
     * Preview HTML in new tab without downloading
     * @param {string} markdown - The markdown source
     * @param {string} filename - Base filename (without extension)
     * @param {string} themeName - Theme to apply
     * @param {boolean} showFooter - Whether to include footer
     * @param {string} extraBodyClass - Optional extra class for body (e.g., font size)
     */
    async previewHTML(markdown, filename, themeName, showFooter = false, extraBodyClass = '') {
        try {
            const marked = window.marked;
            const DOMPurify = window.DOMPurify;
            if (!marked || !DOMPurify) {
                throw new Error('Required libraries not loaded');
            }
            const rawHtml = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(rawHtml);
            const htmlContent = this.generateHTMLTemplate(cleanHtml, themeName, filename, showFooter, extraBodyClass);
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const win = window.open(url, '_blank');
            setTimeout(() => {
                if (win) win.close();
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('HTML preview error:', error);
            window.Logger.error('Failed to preview HTML: ' + error.message);
        }
    }

    /**
     * Generate complete HTML template
     * @param {string} content - Rendered HTML content
     * @param {string} themeName - Theme name
     * @param {string} title - Document title
     * @param {boolean} showFooter - Whether to show footer
     * @param {string} extraBodyClass - Optional extra class for body (e.g., font size)
     * @returns {string} - Complete HTML document
     */
    generateHTMLTemplate(content, themeName, title, showFooter = false, extraBodyClass = '') {
        const theme = this.themes[themeName] || this.themes.github;
        const safeCss = theme.css.replace(/`/g, '\\`');
        const date = new Date().toLocaleDateString();
        const bodyClassAttr = extraBodyClass ? ` class="${extraBodyClass}"` : '';
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="Markdown to File Converter">
    <meta name="date" content="${date}">
    <title>${title}</title>
    <style>
        /* Theme: ${theme.name} */
        ${safeCss}
        /* Highlight.js Styles - GitHub Theme */
        pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{color:#24292e;background:#fff}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#d73a49}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#6f42c1}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-selector-pseudo,.hljs-selector-tag,.hljs-variable{color:#005cc5}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#032f62}.hljs-built_in,.hljs-symbol{color:#e36209}.hljs-code,.hljs-comment,.hljs-formula{color:#6a737d}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#22863a}.hljs-subst{color:#24292e}.hljs-section{color:#005cc5;font-weight:700}.hljs-bullet{color:#735c0f}.hljs-emphasis{color:#24292e;font-style:italic}.hljs-strong{color:#24292e;font-weight:700}.hljs-addition{color:#22863a;background-color:#f0fff4}.hljs-deletion{color:#b31d28;background-color:#ffeef0}
        @media print {
            body { background-color: #fff; }
            a { color: #000; text-decoration: underline; }
            pre, blockquote { page-break-inside: avoid; }
            h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
        }
    </style>
</head>
<body${bodyClassAttr}>
    ${content}
    <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.85rem; color: #666; text-align: center; display: ${showFooter ? 'block' : 'none'};">
        <p>Generated on ${date} by <a href="https://allarddewinter.github.io/markdown-to-file/" target="_blank">The Scribe's Workshop</a>.</p>
    </footer>
</body>
</html>`;
    }
}
