/**
 * Print functionality module
 * Handles print‑specific actions and preview
 */
class PrintManager {
    /**
     * @param {ExportManager} exporter - Instance of ExportManager to reuse HTML generation
     */
    constructor(exporter) {
        this.exporter = exporter;
    }

    /**
     * Retrieve the current print font size class from localStorage.
     * Returns a class name like "print-font-medium".
     * @returns {string}
     */
    _getFontSizeClass() {
        try {
            const raw = localStorage.getItem('markdownToFile');
            if (raw) {
                const data = JSON.parse(raw);
                const size = data.printFontSize || 'medium';
                return `print-font-${size}`;
            }
        } catch (e) {
            // ignore errors and fall back
        }
        return 'print-font-medium';
    }

    /**
     * Print the current document
     * Generates a self‑contained HTML document and opens the browser print dialog.
     * @param {string} markdown - Markdown source
     * @param {string} filename - Base filename (used for the document title)
     * @param {string} themeName - Theme to apply
     */
    async printDocument(markdown, filename, themeName) {
        try {
            // Render markdown using marked and sanitize with DOMPurify (same as ExportManager)
            const marked = window.marked;
            const DOMPurify = window.DOMPurify;

            if (!marked || !DOMPurify) {
                throw new Error('Required libraries not loaded');
            }

            const rawHtml = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(rawHtml);

            // Generate HTML using ExportManager's template helper
            const htmlContent = this.exporter.generateHTMLTemplate(
                cleanHtml,
                themeName,
                filename,
                false,
                this._getFontSizeClass()
            );

            // Open a new window/tab with the generated HTML
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('Popup blocked');
            }
            printWindow.document.write(htmlContent);
            printWindow.document.close();

            // Wait for content to load before printing
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
                // Close the window after printing
                setTimeout(() => printWindow.close(), 100);
            };
        } catch (error) {
            console.error('Print error:', error);
            Logger.error('Failed to print document', error);
        }
    }

    /**
     * Show a print preview (same as HTML preview but with print styles)
     * @param {string} markdown - Markdown source
     * @param {string} filename - Document title
     * @param {string} themeName - Theme to apply
     */
    async previewPrint(markdown, filename, themeName) {
        try {
            // Reuse ExportManager's previewHTML which already includes @media print rules
            await this.exporter.previewHTML(markdown, filename, themeName, false, this._getFontSizeClass());
        } catch (error) {
            console.error('Print preview error:', error);
            Logger.error('Failed to preview print', error);
        }
    }
}
if (typeof module !== 'undefined') {
    module.exports = { PrintManager };
}
