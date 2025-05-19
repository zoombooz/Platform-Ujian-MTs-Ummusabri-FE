// WirisEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';

import Editor from 'https://cdn.ckeditor.com/ckeditor5/36.0.1/classic/ckeditor.js'; // Custom build
import { MathType, ChemType } from 'https://www.wiris.net/demo/plugins/app/Wiris.js';
// import '@wiris/mathtype-ckeditor5/theme/ui.css';
import './wiris-editor.css';

// Konfigurasi Editor
const editorConfiguration = {
  plugins: [MathType, ChemType],
  toolbar: {
    items: [
      'MathType',
      'ChemType',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'blockQuote',
      'insertTable',
      'undo',
      'redo'
    ]
  },
  mathTypeParameters: {
    serviceProviderProperties: {
      URI: window.location.href,
      server: 'php',
      language: 'en'
    }
  },
  chemTypeParameters: {
    serviceProviderProperties: {
      URI: window.location.href,
      server: 'php',
      language: 'en'
    }
  },
  language: 'en'
};

interface WirisEditorProps {
  value?: string;
  onChange?: (data: string) => void;
  onInit?: (editor: any) => void;
}

const WirisEditor: React.FC<WirisEditorProps> = ({ value = '', onChange, onInit }) => {
  const [editorData, setEditorData] = useState(value);
  const editorRef = useRef<any>(null);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    onChange?.(data);
  };

  const handleEditorInit = (editor: any) => {
    editorRef.current = editor;
    onInit?.(editor);
  };

  return (
    <div className="wiris-editor-container">
      <CKEditor
        editor={Editor}
        config={editorConfiguration}
        data={editorData}
        onInit={handleEditorInit}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default WirisEditor;