# PDF Functionality Removal - Step by Step Guide

## Overview
This document provides detailed instructions for removing PDF export functionality from the Markdown to File Converter project. Each step is designed to be executed by a code-focused LLM agent.

## File: export.js

### Step 1: Remove exportToPDF method
**Location:** Lines 160-243
**Action:** Delete the entire `exportToPDF` method including:
```javascript
async exportToPDF(element, filename, themeName, orientation) {
    // ... method content (83 lines)
}
```

### Step 2: Remove optimizeCSSForPDF method  
**Location:** Lines 335-349
**Action:** Delete the entire method:
```javascript
optimizeCSSForPDF(css) {
    // ... method content (14 lines)
}
```

### Step 3: Remove getPDFPrintStyles method
**Location:** Lines 355-365  
**Action:** Delete the entire method:
```javascript
getPDFPrintStyles() {
    // ... method content (10 lines)
}
```

### Step 4: Update class documentation
**Location:** Lines 7-10
**Action:** Change from:
```javascript
/**
 * Export module for PDF and HTML generation
 * Handles creation of downloadable files with theme-specific styling
 * @module export
 */
```
**To:**
```javascript
/**
 * Export module for HTML generation
 * Handles creation of downloadable HTML files with theme-specific styling
 * @module export
 */
```

## File: app.js

### Step 5: Remove exportPDF method
**Location:** Lines 594-627
**Action:** Delete the entire `exportPDF` method (33 lines)

### Step 6: Remove PDF button event listener
**Location:** Line 496
**Action:** Delete the line:
```javascript
document.getElementById('exportPdfBtn').addEventListener('click', () => {
    this.exportPDF();
});
```

### Step 7: Remove orientation from AppState
**Location:** Line 15
**Action:** Remove orientation property:
```javascript
this.orientation = 'portrait';
```

### Step 8: Remove orientation selection event listener
**Location:** Line 484
**Action:** Delete the block:
```javascript
document.getElementById('orientationSelect').addEventListener('change', (e) => {
    this.state.orientation = e.target.value;
    this.state.save();
});
```

### Step 9: Update updateThemeUI method
**Location:** Lines 408-419
**Action:** Change the header subtext from:
```javascript
headerSubtext.textContent = 'Convert markdown to PDF or HTML with syntax highlighting';
```
**To:**
```javascript
headerSubtext.textContent = 'Convert markdown to HTML with syntax highlighting';
```

### Step 10: Remove PDF-specific logging messages
**Location:** Lines 602-608 and 617-623
**Action:** Remove PDF-specific success/error messages from the logging arrays.

## File: index.html

### Step 11: Remove PDF export button
**Location:** Lines 123-125
**Action:** Delete:
```html
<button id="exportPdfBtn" class="btn btn-primary">
    📄 Summon PDF
</button>
```

### Step 12: Remove duplicate preview button
**Location:** Lines 133-135
**Action:** Delete the duplicate:
```html
<button id="previewHtmlBtn" class="btn btn-secondary">
    👁️ Preview HTML
</button>
```

### Step 13: Remove orientation selection
**Location:** Lines 106-112
**Action:** Delete the entire orientation control group:
```html
<div class="control-group">
    <label for="orientationSelect">Orientation:</label>
    <select id="orientationSelect">
        <option value="portrait" selected>Portrait</option>
        <option value="landscape">Landscape</option>
    </select>
</div>
```

### Step 14: Remove html2pdf library import
**Location:** Line 151
**Action:** Delete:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
```

### Step 15: Update header text
**Location:** Line 16
**Action:** Change from:
```html
<p id="headerSubtext">Convert markdown to PDF or HTML with syntax highlighting</p>
```
**To:**
```html
<p id="headerSubtext">Convert markdown to HTML with syntax highlighting</p>
```

### Step 16: Remove duplicate footer toggle
**Location:** Lines 117-120
**Action:** Delete the duplicate footer toggle:
```html
<div class="control-group">
    <label for="footerToggle">Include Footer:</label>
    <input type="checkbox" id="footerToggle">
</div>
```

## File: styles/main.css

### Step 17: Update export controls styling
**Note:** The current styling should work fine for HTML-only, but check for any PDF-specific styles that might need adjustment.

## Testing

### Step 18: Test HTML export functionality
- Verify HTML export button works
- Test HTML preview functionality  
- Ensure no JavaScript errors in console

### Step 19: Verify no PDF references remain
- Search for "pdf" in all files to ensure complete removal
- Check console for any undefined variable errors

## Documentation

### Step 20: Update README.md
**Action:** Remove all references to PDF functionality and update to reflect HTML-only capabilities.

## Execution Order
Execute steps in numerical order. After each file modification, test the application to ensure no breaking changes.

## Verification Checklist
- [ ] Application loads without errors
- [ ] HTML export works correctly
- [ ] HTML preview works correctly  
- [ ] No PDF-related buttons visible
- [ ] No orientation selection visible
- [ ] Console shows no undefined variables
- [ ] All functionality remains except PDF export
