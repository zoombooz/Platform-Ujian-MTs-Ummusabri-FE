import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import Toolbar from 'quill/modules/toolbar';
import Clipboard from 'quill/modules/clipboard';
import katex from 'katex'; // Import library KaTeX
import 'quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';

interface QuillEditorProps {
    value: string;
    [key: string]: any;
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
            const toolbarModule = quillRef.current!.getModule('toolbar') as Toolbar;
            // const toolbarContainer = toolbarModule.container as HTMLElement;
            const toolbarContainer = editorRef.current!.previousElementSibling; // .ql-toolbar
            if (toolbarContainer) {
              // 1. Buat grup tombol helper
              const helperGroup = document.createElement('span');
              helperGroup.classList.add('ql-formats');

              // Fraction button
              const fracBtn = document.createElement('button');
              fracBtn.type = 'button';
              fracBtn.innerHTML = 'a/b';
              fracBtn.title = 'Insert Fraction';
              helperGroup.appendChild(fracBtn);

              // Superscript button
              const superBtn = document.createElement('button');
              superBtn.type = 'button';
              superBtn.innerHTML = '<sup>x</sup>';
              superBtn.title = 'Superscript';
              helperGroup.appendChild(superBtn);

              // Subscript button
              const subBtn = document.createElement('button');
              subBtn.type = 'button';
              subBtn.innerHTML = '<sub>x</sub>';
              subBtn.title = 'Subscript';
              helperGroup.appendChild(subBtn);

              toolbarContainer.appendChild(helperGroup);

              // Tambahkan tombol kalkulus
              const integralBtn = document.createElement('button');
              integralBtn.type = 'button';
              integralBtn.innerHTML = '&int;';
              integralBtn.title = 'Integral';
              helperGroup.appendChild(integralBtn);

              const sumBtn = document.createElement('button');
              sumBtn.type = 'button';
              sumBtn.innerHTML = '&Sigma;';
              sumBtn.title = 'Summation';
              helperGroup.appendChild(sumBtn);

              const sqrtBtn = document.createElement('button');
              sqrtBtn.type = 'button';
              sqrtBtn.innerHTML = '&radic;';
              sqrtBtn.title = 'Square Root';
              helperGroup.appendChild(sqrtBtn);

              const limitBtn = document.createElement('button');
              limitBtn.type = 'button';
              limitBtn.innerHTML = 'lim';
              limitBtn.title = 'Limit';
              helperGroup.appendChild(limitBtn);

              // Handlers
              integralBtn.addEventListener('click', () => {
                openModal(
                  [
                    { label: 'Integrand', placeholder: 'e.g. x^2', key: 'fn' },
                    { label: 'Lower bound', placeholder: 'e.g. 0', key: 'low' },
                    { label: 'Upper bound', placeholder: 'e.g. 1', key: 'upp' }
                  ],
                  vals => {
                    const latex = `\\int_{${vals.low}}^{${vals.upp}} ${vals.fn}`;
                    const range = quillRef.current!.getSelection(true);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });

              sumBtn.addEventListener('click', () => {
                openModal(
                  [
                    { label: 'Expression', placeholder: 'e.g. i^2', key: 'expr' },
                    { label: 'Lower bound', placeholder: 'e.g. i=1', key: 'low' },
                    { label: 'Upper bound', placeholder: 'e.g. n', key: 'upp' }
                  ],
                  vals => {
                    const latex = `\\sum_{${vals.low}}^{${vals.upp}} ${vals.expr}`;
                    const range = quillRef.current!.getSelection(true);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });

              sqrtBtn.addEventListener('click', () => {
                openModal(
                  [{ label: 'Radicand', placeholder: 'e.g. x+1', key: 'rad' }],
                  vals => {
                    const latex = `\\sqrt{${vals.rad}}`;
                    const range = quillRef.current!.getSelection(true);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });

              limitBtn.addEventListener('click', () => {
                openModal(
                  [
                    { label: 'Variable', placeholder: 'e.g. x', key: 'var' },
                    { label: 'Approaches', placeholder: 'e.g. 0', key: 'to' },
                    { label: 'Function', placeholder: 'e.g. sin(x)/x', key: 'fn' }
                  ],
                  vals => {
                    const latex = `\\lim_{${vals.var} \\to ${vals.to}} ${vals.fn}`;
                    const range = quillRef.current!.getSelection(true);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });

              // Utility untuk buka modal input
              function openModal(
                fields: { label: string; placeholder: string; key: string }[],
                onConfirm: (values: Record<string, string>) => void
              ) {
                const backdrop = document.createElement('div');
                Object.assign(backdrop.style, {
                  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                  background: 'rgba(0,0,0,0.5)', display: 'flex',
                  justifyContent: 'center', alignItems: 'center', zIndex: '1000'
                });
                const modal = document.createElement('div');
                Object.assign(modal.style, {
                  background: '#fff', padding: '20px', borderRadius: '4px',
                  minWidth: '300px', maxWidth: '90%'
                });

                const inputs: Record<string, HTMLInputElement> = {};
                fields.forEach(f => {
                  const lbl = document.createElement('label');
                  lbl.textContent = f.label;
                  lbl.style.display = 'block';
                  lbl.style.marginTop = '10px';
                  const inp = document.createElement('input');
                  inp.placeholder = f.placeholder;
                  inp.style.width = '100%';
                  inputs[f.key] = inp;
                  modal.append(lbl, inp);
                });

                const btnGroup = document.createElement('div');
                btnGroup.style.marginTop = '15px';
                btnGroup.style.textAlign = 'right';
                const ok = document.createElement('button');
                ok.textContent = 'Insert';
                const cancel = document.createElement('button');
                cancel.textContent = 'Cancel';
                cancel.style.marginLeft = '8px';
                btnGroup.append(ok, cancel);
                modal.appendChild(btnGroup);

                backdrop.appendChild(modal);
                document.body.appendChild(backdrop);

                ok.onclick = () => {
                  const values: Record<string, string> = {};
                  fields.forEach(f => values[f.key] = inputs[f.key].value.trim());
                  onConfirm(values);
                  document.body.removeChild(backdrop);
                };
                cancel.onclick = () => document.body.removeChild(backdrop);
              }

              // Handler fraction
              fracBtn.addEventListener('click', () => {
                openModal(
                  [
                    { label: 'Numerator', placeholder: 'e.g. a+b', key: 'num' },
                    { label: 'Denominator', placeholder: 'e.g. c', key: 'den' }
                  ],
                  vals => {
                    const latex = `\\frac{${vals.num}}{${vals.den}}`;
                    const range = quillRef.current!.getSelection(true);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });

              // Handler superscript
              superBtn.addEventListener('click', () => {
                const range = quillRef.current!.getSelection(true);
                const selected = range.length
                  ? quillRef.current!.getText(range.index, range.length)
                  : '';
                openModal(
                  [{ label: 'Superscript', placeholder: 'e.g. 2', key: 'sup' }],
                  vals => {
                    const base = selected || '';
                    const latex = `${base}^{${vals.sup}}`;
                    quillRef.current!.deleteText(range.index, range.length);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });

              // Handler subscript
              subBtn.addEventListener('click', () => {
                const range = quillRef.current!.getSelection(true);
                const selected = range.length
                  ? quillRef.current!.getText(range.index, range.length)
                  : '';
                openModal(
                  [{ label: 'Subscript', placeholder: 'e.g. i', key: 'sub' }],
                  vals => {
                    const base = selected || '';
                    const latex = `${base}_{${vals.sub}}`;
                    quillRef.current!.deleteText(range.index, range.length);
                    quillRef.current!.insertEmbed(range.index, 'formula', latex);
                    quillRef.current!.setSelection(range.index + 1);
                  }
                );
              });
            }
            

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