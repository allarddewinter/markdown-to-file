/**
 * Test that changing the print font size in localStorage is reflected in the
 * print preview HTML via the extra body class passed to ExportManager.previewHTML.
 *
 * The PrintManager reads the font size from localStorage (key "markdownToFile")
 * and constructs a class name like "print-font-large". This class is then
 * forwarded as the `extraBodyClass` argument to ExportManager.previewHTML.
 *
 * The test mocks:
 *   - `global.localStorage` to return a specific font size.
 *   - `global.window` and `global.document` minimally for the module imports.
 *   - An ExportManager instance with a mocked `previewHTML` method.
 *
 * The expectation is that `previewHTML` is called with the correct extraBodyClass.
 */

const { PrintManager } = require('../print.js');
const { ExportManager } = require('../export.js');

// Mock minimal browser environment
global.window = {};
global.document = {
  createElement: () => ({
    href: '',
    download: '',
    click: jest.fn(),
  }),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
};

// Mock localStorage to return a known font size
global.localStorage = {
  getItem: jest.fn(() => JSON.stringify({ printFontSize: 'large' })),
};

describe('PrintManager previewPrint integration', () => {
  const sampleMarkdown = '# Test Document';
  const filename = 'test-doc';
  const theme = 'github';

  let exporterMock;
  let printManager;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create a mock ExportManager with a spy on previewHTML
    exporterMock = new ExportManager();
    exporterMock.previewHTML = jest.fn().mockResolvedValue(undefined);

    // Instantiate PrintManager with the mocked exporter
    printManager = new PrintManager(exporterMock);
  });

  test('previewPrint passes the correct print‑font class to previewHTML', async () => {
    await printManager.previewPrint(sampleMarkdown, filename, theme);

    // Expect ExportManager.previewHTML to have been called once
    expect(exporterMock.previewHTML).toHaveBeenCalledTimes(1);

    // Verify the arguments passed to previewHTML
    const [mdArg, fileArg, themeArg, showFooterArg, extraBodyClassArg] =
      exporterMock.previewHTML.mock.calls[0];

    expect(mdArg).toBe(sampleMarkdown);
    expect(fileArg).toBe(filename);
    expect(themeArg).toBe(theme);
    expect(showFooterArg).toBe(false);
    // The extraBodyClass should reflect the mocked font size ("large")
    expect(extraBodyClassArg).toBe('print-font-large');
  });
});