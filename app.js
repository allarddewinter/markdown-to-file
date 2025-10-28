/**
 * Main application entry point
 * Coordinates between markdown rendering, export functionality, and UI interactions
 * @module app
 */

/**
 * Application state and preferences
 * Stores user settings and current document state
 */
class AppState {
    constructor() {
        this.markdown = '';
        this.theme = 'github';
        this.filename = 'document';
        this.orientation = 'portrait';
    }

    /**
     * Load saved state from localStorage
     * Restores user's previous session including markdown content and preferences
     */
    load() {
        try {
            const saved = localStorage.getItem('markdownToFile');
            if (saved) {
                const data = JSON.parse(saved);
                this.markdown = data.markdown || '';
                this.theme = data.theme || 'github';
                this.filename = data.filename || 'document';
                this.orientation = data.orientation || 'portrait';
            }
        } catch (error) {
            Logger.error('Failed to load saved state', error);
        }
    }

    /**
     * Save current state to localStorage
     * Persists user's work and preferences across sessions
     */
    save() {
        try {
            const data = {
                markdown: this.markdown,
                theme: this.theme,
                filename: this.filename,
                orientation: this.orientation
            };
            localStorage.setItem('markdownToFile', JSON.stringify(data));
        } catch (error) {
            Logger.error('Failed to save state', error);
        }
    }
}

/**
 * Message logger for displaying errors, warnings, and info messages to users
 * Provides visual feedback about operations and errors
 */
class Logger {
    /**
     * Log a message to the message log area
     * @param {string} message - The message to display
     * @param {string} type - Message type: 'error', 'warning', 'success', or 'info'
     */
    static log(message, type = 'info') {
        const logContent = document.getElementById('logContent');
        const messageElement = document.createElement('div');
        messageElement.className = `log-message ${type}`;
        
        const icon = {
            error: '❌',
            warning: '⚠️',
            success: '✅',
            info: 'ℹ️'
        }[type] || 'ℹ️';
        
        messageElement.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        logContent.appendChild(messageElement);
        logContent.scrollTop = logContent.scrollHeight;
    }

    static error(message, error) {
        console.error(message, error);
        this.log(`${message}: ${error?.message || error}`, 'error');
    }

    static warning(message) {
        console.warn(message);
        this.log(message, 'warning');
    }

    static success(message) {
        this.log(message, 'success');
    }

    static info(message) {
        this.log(message, 'info');
    }

    static clear() {
        document.getElementById('logContent').innerHTML = '';
    }
}

/**
 * Main application controller
 * Manages the entire application lifecycle and coordinates all components
 */
class App {
    constructor() {
        this.state = new AppState();
        this.renderer = null;
        this.exporter = null;
        this.debounceTimer = null;
    }

    /**
     * Initialize the application
     * Sets up all event listeners, loads saved state, and initializes components
     */
    async init() {
        try {
            // Load saved state
            this.state.load();

            // Initialize components
            this.renderer = new MarkdownRenderer();
            this.exporter = new ExportManager();

            // Restore UI state
            this.restoreUIState();

            // Setup event listeners
            this.setupEventListeners();

            // Initial render if there's saved markdown
            if (this.state.markdown) {
                this.updatePreview();
            }

            const greetings = [
                'Application initialized. You may proceed.',
                'The scribes are ready to serve you.',
                'Workshop opened successfully. What shall we create today?',
                'All systems operational. Blessed are the developers.'
            ];
            Logger.info(greetings[Math.floor(Math.random() * greetings.length)]);
        } catch (error) {
            Logger.error('Failed to initialize application', error);
        }
    }

    /**
     * Restore UI elements from saved state
     * Updates form fields to match saved preferences
     */
    restoreUIState() {
        document.getElementById('markdownInput').value = this.state.markdown;
        document.getElementById('themeSelect').value = this.state.theme;
        document.getElementById('filenameInput').value = this.state.filename;
        document.getElementById('orientationSelect').value = this.state.orientation;
        
        this.updateTheme(this.state.theme);
        this.updateThemeUI(this.state.theme);
    }

    /**
     * Update UI elements based on theme selection
     * Adds Python-esque humor when appropriate
     * @param {string} themeName - Name of the theme
     */
    updateThemeUI(themeName) {
        const mainTitle = document.getElementById('mainTitle');
        const headerSubtext = document.getElementById('headerSubtext');
        
        if (themeName === 'python') {
            mainTitle.textContent = '📜 The Scribe\'s Workshop 📜';
            headerSubtext.textContent = 'Where ancient scrolls meet modern export capabilities';
        } else {
            mainTitle.textContent = 'Markdown to File Converter';
            headerSubtext.textContent = 'Convert markdown to PDF or HTML with syntax highlighting';
        }
    }

    /**
     * Setup all event listeners for user interactions
     * Wires up buttons, inputs, and file upload functionality
     */
    setupEventListeners() {
        // Markdown input with debounced update (300ms delay reduces rendering overhead)
        document.getElementById('markdownInput').addEventListener('input', (e) => {
            this.state.markdown = e.target.value;
            this.debouncedUpdate();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Are you sure? This will erase all your precious scribblings!')) {
                this.state.markdown = '';
                document.getElementById('markdownInput').value = '';
                this.updatePreview();
                Logger.info('Content obliterated. What a waste.');
            }
        });

        // File upload
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files[0]);
        });

        // Theme selection
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.state.theme = e.target.value;
            this.updateTheme(e.target.value);
            this.updateThemeUI(e.target.value);
            this.state.save();
        });

        // Filename input
        document.getElementById('filenameInput').addEventListener('input', (e) => {
            this.state.filename = e.target.value || 'document';
            this.state.save();
        });

        // Add timestamp button
        document.getElementById('addTimestampBtn').addEventListener('click', () => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const currentName = document.getElementById('filenameInput').value || 'document';
            const newName = `${currentName}_${timestamp}`;
            document.getElementById('filenameInput').value = newName;
            this.state.filename = newName;
            this.state.save();
            const messages = [
                'Timestamp inscribed upon the scroll',
                'Marked with the passage of time',
                'The hour has been noted for posterity',
                'Timestamped. How very bureaucratic.'
            ];
            Logger.info(messages[Math.floor(Math.random() * messages.length)]);
        });

        // Orientation selection
        document.getElementById('orientationSelect').addEventListener('change', (e) => {
            this.state.orientation = e.target.value;
            this.state.save();
        });

        // Export buttons
        document.getElementById('exportPdfBtn').addEventListener('click', () => {
            this.exportPDF();
        });

        document.getElementById('exportHtmlBtn').addEventListener('click', () => {
            this.exportHTML();
        });

        // Clear log button
        document.getElementById('clearLog').addEventListener('click', () => {
            Logger.clear();
        });
    }

    /**
     * Debounced update for preview
     * Prevents excessive rendering while user is typing (300ms delay)
     * This improves performance especially with large documents
     */
    debouncedUpdate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updatePreview();
            this.state.save();
        }, 300);
    }

    /**
     * Update the preview pane with rendered markdown
     * Converts markdown to HTML with syntax highlighting
     */
    updatePreview() {
        try {
            const html = this.renderer.render(this.state.markdown);
            document.getElementById('preview').innerHTML = html;
        } catch (error) {
            Logger.error('Failed to render preview', error);
        }
    }

    /**
     * Handle file upload
     * Reads and loads markdown from uploaded .md or .txt files
     * @param {File} file - The uploaded file
     */
    async handleFileUpload(file) {
        if (!file) return;

        try {
            const text = await file.text();
            this.state.markdown = text;
            document.getElementById('markdownInput').value = text;
            this.updatePreview();
            this.state.save();
            const messages = [
                `Scroll "${file.name}" has been retrieved from the archives`,
                `"${file.name}" summoned successfully. What wisdom does it contain?`,
                `The ancient text "${file.name}" is now before you`,
                `File "${file.name}" loaded. Blessed are the document handlers.`
            ];
            Logger.success(messages[Math.floor(Math.random() * messages.length)]);
        } catch (error) {
            Logger.error('The scroll could not be read! Perhaps it is cursed?', error);
        }
    }

    /**
     * Update the preview theme
     * Changes both the CSS variables and syntax highlighting theme
     * @param {string} themeName - Name of the theme to apply
     */
    updateTheme(themeName) {
        // Update syntax highlighting theme
        const themeLink = document.getElementById('highlight-theme');
        const themeMap = {
            github: 'github',
            dark: 'github-dark',
            minimal: 'default',
            professional: 'github',
            python: 'github'
        };

        const hlTheme = themeMap[themeName] || 'github';
        themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${hlTheme}.min.css`;
        
        // Update preview content theme
        const previewThemeLink = document.getElementById('preview-theme');
        previewThemeLink.href = `styles/themes/${themeName}.css`;
    }

    /**
     * Export current markdown as PDF
     * Uses html2pdf.js with theme-specific styling and user preferences
     */
    async exportPDF() {
        try {
            const preview = document.getElementById('preview');
            if (!preview.innerHTML.trim()) {
                Logger.warning('Nothing to export! The scroll is blank.');
                return;
            }

            const messages = [
                'Summoning PDF from the ether...',
                'Consulting the ancient PDF spirits...',
                'Inscribing upon digital parchment...',
                'The PDF scribes are hard at work...'
            ];
            Logger.info(messages[Math.floor(Math.random() * messages.length)]);
            
            await this.exporter.exportToPDF(
                preview,
                this.state.filename,
                this.state.theme,
                this.state.orientation
            );
            
            const successMessages = [
                'PDF materialized! A miracle of modern technology.',
                'Your PDF has been summoned successfully.',
                'Behold, a PDF! What wonders we create.',
                'PDF exported. Go forth and distribute knowledge.'
            ];
            Logger.success(successMessages[Math.floor(Math.random() * successMessages.length)]);
        } catch (error) {
            Logger.error('The PDF spirits have rejected your offering', error);
        }
    }

    /**
     * Export current markdown as self-contained HTML
     * Creates a complete HTML document with inlined styles
     */
    async exportHTML() {
        try {
            if (!this.state.markdown.trim()) {
                Logger.warning('The void cannot be exported. Write something first!');
                return;
            }

            const messages = [
                'Weaving HTML incantations...',
                'Crafting a portable document of power...',
                'The HTML artisans are at work...',
                'Forging a self-contained webpage...'
            ];
            Logger.info(messages[Math.floor(Math.random() * messages.length)]);
            
            await this.exporter.exportToHTML(
                this.state.markdown,
                this.state.filename,
                this.state.theme
            );
            
            const successMessages = [
                'HTML crafted! Open it anywhere, anytime.',
                'Your HTML document stands ready. It is... adequate.',
                'HTML exported successfully. Now go and view it!',
                'Behold! A complete HTML document has been created.'
            ];
            Logger.success(successMessages[Math.floor(Math.random() * successMessages.length)]);
        } catch (error) {
            Logger.error('The HTML weaving has failed catastrophically', error);
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
    });
} else {
    const app = new App();
    app.init();
}

// Make Logger globally available for export modules
window.Logger = Logger;
