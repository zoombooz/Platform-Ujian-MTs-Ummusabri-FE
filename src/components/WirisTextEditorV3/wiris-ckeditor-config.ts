// Configuration options for WIRIS MathType CKEditor integration
export const wirisEditorConfig = {
  // MathType specific configuration
  mathTypeParameters: {
    editorParameters: {
      // Language for the MathType interface
      language: "en",

      // Define whether formulas are saved as MathML, image, or both
      saveMode: "xml",

      // Define formula editor mode (inline or modal)
      editorMode: "default",

      // URL of the WIRIS service if you're self-hosting
      // serviceProviderProperties: {
      //   URI: 'your-service-url',
      //   server: 'your-server-url'
      // }
      telemetry: false
    },

    // ChemType specific configuration
    chemTypeParameters: {
      // Language for the ChemType interface
      language: "en",
    },
  },

  // CKEditor toolbar configuration with MathType buttons
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "MathType",
      "ChemType",
      "|",
      "undo",
      "redo",
    ],
  },
}
