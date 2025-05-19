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
  const scriptsLoaded = useRef(false)

  useEffect(() => {
    const loadEditor = () => {
      if (!editorContainerRef.current || editorInstance.current) return

      // Bersihkan instance sebelumnya
      if (window.CKEDITOR.instances.editorContainer) {
        window.CKEDITOR.instances.editorContainer.destroy()
      }

      // Konfigurasi utama
      editorInstance.current = window.CKEDITOR.replace(editorContainerRef.current, {
        height: typeof height === "number" ? `${height}px` : height,
        extraPlugins: 'ckeditor_wiris,mathjax,image2', // Hanya gunakan image2
        removePlugins: 'image', // Pastikan plugin image tidak terload
        mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
        toolbar: [
          { name: 'document', items: ['Source', '-', 'Save', 'Preview'] },
          { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo'] },
          { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
          { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
          { name: 'links', items: ['Link', 'Unlink'] },
          { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'Mathjax', 'ckeditor_wiris_formulaEditor'] },
          { name: 'styles', items: ['Styles', 'Format'] },
          { name: 'tools', items: ['Maximize'] }
        ],
        readOnly,
        placeholder,
        mathTypeParameters: {
          editorParameters: {
            telemetry: false,
            language: 'en'
          }
        }
      })

      // Handle data awal dan perubahan
      editorInstance.current.setData(initialData)
      editorInstance.current.on('change', () => {
        onChange?.(editorInstance.current.getData())
      })

      setEditorLoaded(true)
    }

    const loadWirisPlugin = () => {
      if (window.WirisPlugin) {
        window.CKEDITOR.plugins.addExternal(
          'ckeditor_wiris',
          'https://www.wiris.net/demo/plugins/ckeditor/',
          'plugin.js'
        )
        loadEditor()
        return
      }

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

    const loadCKEditor = () => {
      if (window.CKEDITOR) {
        loadWirisPlugin()
        return
      }

      const ckeditorScript = document.createElement('script')
      ckeditorScript.src = 'https://cdn.ckeditor.com/4.17.1/standard-all/ckeditor.js'
      ckeditorScript.async = true
      ckeditorScript.onload = loadWirisPlugin
      document.head.appendChild(ckeditorScript)
    }

    if (!scriptsLoaded.current) {
      scriptsLoaded.current = true
      loadCKEditor()
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy()
        editorInstance.current = null
      }
      setEditorLoaded(false)
    }
  }, [])

  useEffect(() => {
    if (editorInstance.current && initialData !== editorInstance.current.getData()) {
      editorInstance.current.setData(initialData)
    }
  }, [initialData])

  return (
    <div className={`wiris-editor-container ${className}`}>
      <div ref={editorContainerRef} />
      {!editorLoaded && (
        <div className="editor-loading">
          <div className="loading-spinner" />
          Loading editor...
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