"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface WirisCKEditorProps {
  initialData?: string
  onChange?: (data: string) => void
  height?: string | number
  placeholder?: string
  readOnly?: boolean
  className?: string
}

const WirisCKEditor: React.FC<WirisCKEditorProps> = ({
  initialData = "",
  onChange,
  height = "300px",
  placeholder = "Type or insert math equation...",
  readOnly = false,
  className = "",
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const [editorData, setEditorData] = useState(initialData)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const [editorInstance, setEditorInstance] = useState<any>(null)

  useEffect(() => {
    // Load CKEditor and WIRIS MathType scripts
    const loadScripts = async () => {
      // Only load scripts in browser environment
      if (typeof window === "undefined") return

      // Check if scripts are already loaded
      if (window.CKEDITOR) {
        initializeEditor()
        return
      }

      try {
        // Load CKEditor script
        const ckeditorScript = document.createElement("script")
        ckeditorScript.src = "https://cdn.ckeditor.com/4.17.1/standard-all/ckeditor.js"
        ckeditorScript.async = true

        // Load WIRIS MathType script after CKEditor is loaded
        ckeditorScript.onload = () => {
          const wirisScript = document.createElement("script")
          wirisScript.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image"
          wirisScript.async = true
          wirisScript.onload = initializeEditor
          document.head.appendChild(wirisScript)
        }

        document.head.appendChild(ckeditorScript)
      } catch (error) {
        console.error("Error loading editor scripts:", error)
      }
    }

    const initializeEditor = () => {
      if (!editorContainerRef.current || !window.CKEDITOR) return

      // Clean up any existing instance
      if (window.CKEDITOR.instances.editor) {
        window.CKEDITOR.instances.editor.destroy(true)
      }

      // Initialize CKEditor with WIRIS MathType plugin
      let editor = window.CKEDITOR.replace("editor", {
        height: typeof height === "number" ? `${height}px` : height,
        extraPlugins: "mathjax,image2,uploadimage,justify,colorbutton,font",
        mathJaxLib: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML",
        toolbar: [
          { name: "document", items: ["Source"] },
          { name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"] },
          { name: "editing", items: ["Find", "Replace", "-", "SelectAll"] },
          {
            name: "basicstyles",
            items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"],
          },
          {
            name: "paragraph",
            items: [
              "NumberedList",
              "BulletedList",
              "-",
              "Outdent",
              "Indent",
              "-",
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
            ],
          },
          { name: "insert", items: ["Image", "Table", "HorizontalRule", "SpecialChar", "MathJax"] },
          { name: "styles", items: ["Styles", "Format", "Font", "FontSize", "TextColor", "BGColor"] },
          { name: "tools", items: ["Maximize"] },
        ],
        readOnly: readOnly,
        placeholder: placeholder,
        removeButtons: "",
        contentsCss: [
          "https://cdn.ckeditor.com/4.17.1/standard-all/contents.css",
          "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML",
        ],
      })

      // Set initial data
      editor.setData(initialData)

      // Handle editor events
      editor.on("change", () => {
        const data = editor.getData()
        setEditorData(data)
        console.log("Editor data changed:", data)
        if (onChange) {
          onChange(data)
        }
      })

      // Add WIRIS MathType if available
      if (window.CKEDITOR.plugins && typeof window.CKEDITOR.plugins.addExternal === "function") {
        try {
          // Try to add WIRIS MathType plugin
          window.CKEDITOR.plugins.addExternal(
            "ckeditor_wiris",
            "https://www.wiris.net/demo/plugins/ckeditor/",
            "plugin.js",
          )

          // Update editor configuration to include WIRIS plugin
          editor.config.extraPlugins += ",ckeditor_wiris"

          // Reload editor with new configuration
          editor.destroy()
          editor = window.CKEDITOR.replace("editor", editor.config)

          console.log("WIRIS MathType plugin loaded successfully")
        } catch (error) {
          console.warn("Could not load WIRIS MathType plugin:", error)
        }
      }

      setEditorInstance(editor)
      setEditorLoaded(true)
    }
    try {
      loadScripts()
      return () => {
        if (editorInstance) {
          editorInstance.destroy()
        }
      }
    } catch (error) {
      alert("Error loading editor scripts:", error)
    }

    // Cleanup on unmount
  }, [initialData, height, placeholder, readOnly])

  // Update editor data when initialData prop changes
  useEffect(() => {
    if (editorInstance && initialData !== editorData) {
      editorInstance.setData(initialData)
    }
  }, [initialData, editorData, editorInstance])

  return (
    <div className={`wiris-ckeditor-container ${className}`}>
      <div ref={editorContainerRef}>
        <textarea id="editor" name="editor" style={{ display: "none" }} defaultValue={initialData} />
      </div>
      {!editorLoaded && (
        <div className="p-4 text-center">
          <div className="animate-pulse">Loading editor...</div>
        </div>
      )}
    </div>
  )
}

// Add TypeScript declaration for CKEDITOR global
declare global {
  interface Window {
    CKEDITOR: any
  }
}

export default WirisCKEditor
