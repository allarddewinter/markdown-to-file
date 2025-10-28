/**
 * Markdown rendering module
 * Handles conversion of markdown to HTML with GFM support, syntax highlighting, and XSS protection
 * @module markdown
 */

/**
 * MarkdownRenderer class
 * Configures and manages markdown-to-HTML conversion with security and highlighting
 */
class MarkdownRenderer {
    constructor() {
        this.initializeMarked();
    }

    /**
     * Initialize Marked.js with GFM (GitHub Flavored Markdown) settings
     * Configuration rationale:
     * - GFM: true - Enables tables, strikethrough, task lists, etc.
     * - breaks: true - Converts line breaks to <br> (GitHub behavior)
     * - highlight: Integrates Highlight.js for code syntax highlighting
     */
    initializeMarked() {
        if (typeof marked === 'undefined') {
            throw new Error('Marked.js library not loaded');
        }

        marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convert \n to <br>
            headerIds: true, // Generate IDs for headers
            mangle: false, // Don't escape email addresses
            pedantic: false, // Don't use original markdown.pl behavior
            
            /**
             * Highlight code blocks using Highlight.js
             * @param {string} code - The code content
             * @param {string} lang - The language identifier
             * @returns {string} - Highlighted HTML or original code
             * 
             * Design decision: Auto-detect language if not specified to maximize
             * highlighting coverage for LLM-generated code snippets
             */
            highlight: (code, lang) => {
                if (typeof hljs === 'undefined') {
                    return code;
                }

                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (error) {
                        console.warn('Highlighting failed for language:', lang, error);
                    }
                }

                // Auto-detect language if not specified or unknown
                try {
                    return hljs.highlightAuto(code).value;
                } catch (error) {
                    console.warn('Auto-highlighting failed:', error);
                    return code;
                }
            }
        });
    }

    /**
     * Render markdown to sanitized HTML
     * @param {string} markdown - The markdown source text
     * @returns {string} - Sanitized HTML output
     * 
     * Security: Uses DOMPurify to prevent XSS attacks while preserving
     * legitimate HTML from markdown (like tables and formatting)
     * 
     * Performance: marked.parse is synchronous and fast for typical documents,
     * but large documents (>100KB) may cause brief UI freezes
     */
    render(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        try {
            // Convert markdown to HTML
            const rawHtml = marked.parse(markdown);
            
            // Sanitize HTML to prevent XSS attacks
            // DOMPurify config allows safe HTML elements while blocking scripts
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'hr',
                    'strong', 'em', 'del', 'code', 'pre',
                    'ul', 'ol', 'li',
                    'a', 'img',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'blockquote',
                    'div', 'span'
                ],
                ALLOWED_ATTR: [
                    'href', 'src', 'alt', 'title',
                    'class', 'id',
                    'align', 'colspan', 'rowspan'
                ],
                // Allow data URIs for images but only for safe types
                ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
            });

            return cleanHtml;
        } catch (error) {
            console.error('Markdown rendering error:', error);
            throw new Error('Failed to render markdown: ' + error.message);
        }
    }

    /**
     * Validate markdown syntax
     * @param {string} markdown - The markdown to validate
     * @returns {Object} - Validation result with warnings
     * 
     * Extension point: Can be enhanced to check for common markdown issues
     * like unclosed code blocks, malformed tables, etc.
     */
    validate(markdown) {
        const warnings = [];

        // Check for unclosed code blocks
        const codeBlockMatches = (markdown.match(/```/g) || []).length;
        if (codeBlockMatches % 2 !== 0) {
            warnings.push('Unclosed code block detected');
        }

        // Check for very large documents (performance warning)
        if (markdown.length > 500000) { // 500KB
            warnings.push('Large document detected - rendering may be slow');
        }

        return {
            valid: warnings.length === 0,
            warnings
        };
    }
}
