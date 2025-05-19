"use client"

import { useEffect, useRef, useState } from "react"

interface WirisCKEditorProps {
  initialData?: string
  onChange?: (data: string) => void
  height?: string | number
  placeholder?: string
  readOnly?: boolean
  className?: string
}

const WirisCKEditor = ({
  initialData = "",
  onChange,
  height = "300px",
  placeholder = "Type or insert math equation...",
  readOnly = false,
  className = "",
}: WirisCKEditorProps) => {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const [editorLoaded, setEditorLoaded] = useState(false)
  const editorInstance = useRef<any>(null)

  useEffect(() => {
    const loadEditor = () => {
      if (typeof window === "undefined" || !editorContainerRef.current) return

      // Configure global editor settings
      window.CKEDITOR.editorConfig = function(config) {
        config.mathTypeParameters = {
          editorParameters: {
            telemetry: false, // Disable Wiris telemetry
            language: 'en' // Set default language
          }
        }
      }

      // Initialize CKEditor instance
      editorInstance.current = window.CKEDITOR.replace(editorContainerRef.current, {
        height: typeof height === "number" ? `${height}px` : height,
        extraPlugins: 'ckeditor_wiris,mathjax,image2,uploadimage',
        mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
        toolbar: [
          { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
          { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
          { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
          { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
          '/',
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
          { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
          { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe', 'Mathjax', 'ckeditor_wiris_formulaEditor', 'ckeditor_wiris_formulaEditorChemistry'] },
          '/',
          { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
          { name: 'colors', items: ['TextColor', 'BGColor'] },
          { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
          { name: 'about', items: ['About'] }
        ],
        readOnly,
        placeholder,
        mathTypeParameters: {
          editorParameters: {
            telemetry: false // Ensure telemetry is disabled
          }
        },
        contentsCss: [
          'https://cdn.ckeditor.com/4.17.1/standard-all/contents.css',
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        ]
      })

      // Set initial data
      editorInstance.current.setData(initialData)

      // Handle editor changes
      editorInstance.current.on('change', () => {
        const data = editorInstance.current.getData()
        onChange?.(data)
      })

      setEditorLoaded(true)
    }

    const loadScripts = () => {
      if (typeof window === "undefined") return

      // Load CKEditor if not already loaded
      if (!window.CKEDITOR) {
        const ckeditorScript = document.createElement('script')
        ckeditorScript.src = 'https://cdn.ckeditor.com/4.17.1/standard-all/ckeditor.js'
        ckeditorScript.async = true
        ckeditorScript.onload = loadWirisPlugin
        document.head.appendChild(ckeditorScript)
      } else {
        loadWirisPlugin()
      }
    }

    const loadWirisPlugin = () => {
      if (typeof window.WirisPlugin !== 'undefined') return

      const wirisScript = document.createElement('script')
      wirisScript.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image'
      wirisScript.async = true
      wirisScript.onload = () => {
        window.CKEDITOR.plugins.addExternal(
          'ckeditor_wiris',
          'https://www.wiris.net/demo/plugins/ckeditor/',
          'plugin.js'
        )
        loadEditor()
      }
      document.head.appendChild(wirisScript)
    }

    loadScripts()

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy()
        editorInstance.current = null
      }
    }
  }, [height, placeholder, readOnly])

  useEffect(() => {
    if (editorInstance.current && initialData !== editorInstance.current.getData()) {
      editorInstance.current.setData(initialData)
    }
  }, [initialData])

  return (
    <div className={`wiris-editor-container ${className}`}>
      <div ref={editorContainerRef} />
      {!editorLoaded && (
        <div className="editor-loading-state">
          <div className="loading-spinner" />
          <p>Loading formula editor...</p>
        </div>
      )}
    </div>
  )
}

declare global {
  interface Window {
    CKEDITOR: any
    WirisPlugin: any
  }
}

export default WirisCKEditor