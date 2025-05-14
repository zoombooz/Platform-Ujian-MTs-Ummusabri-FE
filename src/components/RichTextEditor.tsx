import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import katex from 'katex'; // Import library KaTeX
import 'quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
}

const RichTextEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && editorRef.current && !quillRef.current) {
            // 1. Load KaTeX ke window global
            (window as any).katex = katex;

            // 2. Import dan registrasi modul formula
            const Formula = Quill.import('formats/formula');
            Quill.register('formats/formula', Formula, true);

            // 3. Inisialisasi Quill dengan konfigurasi katex
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'formula'],
                        ['clean'],
                    ],
                    // 4. Tambahkan konfigurasi formula
                    formula: {
                        katexOptions: {
                            output: 'html',
                            throwOnError: false,
                        }
                    }
                },
            });

            // Set nilai awal
            quillRef.current.root.innerHTML = value;

            // Listen perubahan
            quillRef.current.on('text-change', () => {
                const content = quillRef.current?.root.innerHTML || '';
                onChange(content);
            });
        }

        return () => {
            quillRef.current = null;
        };
    }, []);

    return (
        <div ref={editorRef} />
    );
};

export default RichTextEditor;