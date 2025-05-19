/**
 * Utility functions for working with WIRIS MathType
 */

/**
 * Checks if CKEditor is loaded in the current environment
 * @returns Boolean indicating if CKEditor is available
 */
export function isCKEditorAvailable(): boolean {
  return typeof window !== "undefined" && !!window.CKEDITOR
}

/**
 * Checks if WIRIS MathType plugin is loaded
 * @returns Boolean indicating if WIRIS MathType plugin is available
 */
export function isWirisMathTypeAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.CKEDITOR &&
    !!window.CKEDITOR.plugins &&
    !!window.CKEDITOR.plugins.registered &&
    !!window.CKEDITOR.plugins.registered.ckeditor_wiris
  )
}

/**
 * Loads CKEditor script dynamically
 * @returns Promise that resolves when the script is loaded
 */
export function loadCKEditorScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()

  if (window.CKEDITOR) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://cdn.ckeditor.com/4.17.1/standard-all/ckeditor.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load CKEditor script"))
    document.head.appendChild(script)
  })
}

/**
 * Loads WIRIS MathType script dynamically
 * @returns Promise that resolves when the script is loaded
 */
export function loadWirisMathTypeScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()

  if (!window.CKEDITOR) {
    return Promise.reject(new Error("CKEditor must be loaded before loading WIRIS MathType"))
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load WIRIS MathType script"))
    document.head.appendChild(script)
  })
}

/**
 * Extracts MathML content from HTML
 * @param html HTML content containing MathML
 * @returns Array of MathML strings
 */
export function extractMathML(html: string): string[] {
  const mathMLRegex = /<math[\s\S]*?<\/math>/g
  return html.match(mathMLRegex) || []
}

/**
 * Extracts LaTeX content from HTML
 * @param html HTML content containing LaTeX
 * @returns Array of LaTeX strings
 */
export function extractLaTeX(html: string): string[] {
  const latexRegex = /\$$.+?)\$$/g
  return html.match(latexRegex) || []
}
