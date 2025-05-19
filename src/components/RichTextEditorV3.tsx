// /*
//   WirisRichTextEditor Component
//   --------------------------------
//   React + TypeScript wrapper for CKEditor5 Classic UMD build + MathType via CDN.
//   Uses global CKEDITOR object and EditorWatchdog from UMD.

//   Setup:
//   1. In public/index.html before React bundle:
//      ```html
//      <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css" />
//      <script src="https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.umd.js"></script>
//      <script src="https://www.wiris.net/demo/plugins/ckeditor5/mathType.js"></script>
//      ```
//   2. Install React wrapper:
//      ```bash
//      npm install --save @ckeditor/ckeditor5-react
//      ```
// */
// import React, { FC, useRef, useState } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';

// // CKEDITOR global from UMD bundle
// declare global { interface Window { CKEDITOR: any; } }
// const { ClassicEditor, EditorWatchdog } = window.CKEDITOR;

// interface WirisRichTextEditorProps {
//   value: string;
//   onChange: (data: string) => void;
// }

// type FormulaType =
//   | 'integral' | 'sum' | 'limit' | 'fraction' | 'sqrt'
//   | 'derivative' | 'partial' | 'matrix' | 'vector' | 'determinant' | 'complex'
//   | 'superscript' | 'subscript';

// // Toolbar including MathType, ChemType, and custom formula buttons
// const toolbarItems: (FormulaType | string)[] = [
//   'heading','|','bold','italic','underline','link','|',
//   'bulletedList','numberedList','|','MathType','ChemType','|',
//   'integral','sum','limit','fraction','sqrt','derivative','partial','matrix','vector','determinant','complex','superscript','subscript','|','undo','redo'
// ];

// const editorConfig = {
//   toolbar: { items: toolbarItems },
//   language: 'en',
//   math: { engine: 'mathjax', outputType: 'span' }
// };

// // Input fields definitions for each formula type
// interface FieldDef { key: string; label: string; placeholder: string; }
// const formulaFields: Record<FormulaType, FieldDef[]> = {
//   integral: [ { key: 'fn', label: 'Integrand', placeholder: 'x^2' }, { key: 'low', label: 'Lower bound', placeholder: '0' }, { key: 'upp', label: 'Upper bound', placeholder: '1' } ],
//   sum: [ { key: 'expr', label: 'Expression', placeholder: 'i^2' }, { key: 'low', label: 'Lower bound', placeholder: 'i=1' }, { key: 'upp', label: 'Upper bound', placeholder: 'n' } ],
//   limit: [ { key: 'var', label: 'Variable', placeholder: 'x' }, { key: 'to', label: 'Approaches', placeholder: '0' }, { key: 'fn', label: 'Function', placeholder: 'sin(x)/x' } ],
//   fraction: [ { key: 'num', label: 'Numerator', placeholder: 'a+b' }, { key: 'den', label: 'Denominator', placeholder: 'c' } ],
//   sqrt: [ { key: 'rad', label: 'Radicand', placeholder: 'x+1' } ],
//   derivative: [ { key: 'fn', label: 'Function', placeholder: 'sin(x)' }, { key: 'var', label: 'Variable', placeholder: 'x' } ],
//   partial: [ { key: 'fn', label: 'Function', placeholder: 'f(x,y)' }, { key: 'var', label: 'Variable', placeholder: 'x' } ],
//   matrix: [ { key: 'rows', label: 'Rows', placeholder: '2' }, { key: 'cols', label: 'Columns', placeholder: '2' }, { key: 'entries', label: 'Entries (comma-separated)', placeholder: '1,2,3,4' } ],
//   vector: [ { key: 'entries', label: 'Components (comma-separated)', placeholder: '1,2,3' } ],
//   determinant: [ { key: 'rows', label: 'Rows', placeholder: '3' }, { key: 'cols', label: 'Columns', placeholder: '3' }, { key: 'entries', label: 'Entries (comma-separated)', placeholder: '1,2,...,9' } ],
//   complex: [ { key: 'real', label: 'Real part', placeholder: 'a' }, { key: 'imag', label: 'Imaginary part', placeholder: 'b' } ],
//   superscript: [ { key: 'sup', label: 'Superscript', placeholder: '2' } ],
//   subscript: [ { key: 'sub', label: 'Subscript', placeholder: 'i' } ]
// };

// // Modal for formula input
// type ModalProps = { type:FormulaType; onSubmit:(vals:Record<string,string>)=>void; onClose:()=>void };
// const FormModal: FC<ModalProps> = ({ type, onSubmit, onClose }) => {
//   const fields = formulaFields[type];
//   const [values, setValues] = useState<Record<string,string>>(Object.fromEntries(fields.map(f => [f.key, ''])));

//   return (
//     <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
//       <div style={{ background:'#fff', padding:24, borderRadius:8, minWidth:300 }}>
//         <h3>Insert {type}</h3>
//         {fields.map(f => (
//           <div key={f.key} style={{ marginTop:12 }}>
//             <label>{f.label}</label>
//             <input
//               style={{ width:'100%', padding:4 }}
//               placeholder={f.placeholder}
//               value={values[f.key] || ''}
//               onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
//             />
//           </div>
//         ))}
//         <div style={{ marginTop:16, textAlign:'right' }}>
//           <button onClick={onClose} style={{ marginRight:8 }}>Cancel</button>
//           <button onClick={() => onSubmit(values)}>Insert</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const WirisRichTextEditor: FC<WirisRichTextEditorProps> = ({ value, onChange }) => {
//   const editorRef = useRef<any>(null);
//   const [modalType, setModalType] = useState<FormulaType|null>(null);
//   const watchdog = new EditorWatchdog(ClassicEditor);

//   const handleInsert = (vals: Record<string,string>) => {
//     const t = modalType!;
//     let latex = '';
//     switch(t) {
//       case 'integral': latex = `\\int_{${vals.low}}^{${vals.upp}} ${vals.fn}`; break;
//       case 'sum': latex = `\\sum_{${vals.low}}^{${vals.upp}} ${vals.expr}`; break;
//       case 'limit': latex = `\\lim_{${vals.var} \\to ${vals.to}} ${vals.fn}`; break;
//       case 'fraction': latex = `\\frac{${vals.num}}{${vals.den}}`; break;
//       case 'sqrt': latex = `\\sqrt{${vals.rad}}`; break;
//       case 'derivative': latex = `\\frac{d}{d${vals.var}}(${vals.fn})`; break;
//       case 'partial': latex = `\\frac{\\partial}{\\partial ${vals.var}}(${vals.fn})`; break;
//       case 'matrix': {
//         const r=+vals.rows, c=+vals.cols;
//         const arr=vals.entries.split(',').map(x=>x.trim());
//         const rowsArr=Array.from({length:r},(_,i)=>arr.slice(i*c,i*c+c).join(' & '));
//         latex = `\\begin{pmatrix}${rowsArr.join(' \\\\ ')}\\end{pmatrix}`;
//         break;
//       }
//       case 'vector': latex = `\\begin{pmatrix}${vals.entries.split(',').join(' & ')}\\end{pmatrix}`; break;
//       case 'determinant': {
//         const r2=+vals.rows, c2=+vals.cols;
//         const arr2=vals.entries.split(',').map(x=>x.trim());
//         const rows2=Array.from({length:r2},(_,i)=>arr2.slice(i*c2,i*c2+c2).join(' & '));
//         latex = `\\begin{vmatrix}${rows2.join(' \\\\ ')}\\end{vmatrix}`;
//         break;
//       }
//       case 'complex': latex = `${vals.real} + ${vals.imag}i`; break;
//       case 'superscript': latex = `{ }^{${vals.sup}}`; break;
//       case 'subscript': latex = `{ }_{${vals.sub}}`; break;
//     }
//     editorRef.current.model.change((writer: any) => {
//       const pos = editorRef.current.model.document.selection.getFirstPosition();
//       const node = writer.createElement('math', { mathType: 'MathType', value: latex });
//       writer.insert(node, pos);
//     });
//     setModalType(null);
//   };

//   const registerButtons = (editor: any) => {
//     const t = editor.locale.t;
//     toolbarItems.forEach(item => {
//       if ((formulaFields as any)[item]) {
//         editor.ui.componentFactory.add(item as string, locale => {
//           const btn = new (window as any).CKEDITOR5.ui.ButtonView(locale);
//           btn.set({ label: t(item as string), tooltip: true, withText: true });
//           btn.on('execute', () => setModalType(item as FormulaType));
//           return btn;
//         });
//       }
//     });
//   };

//   return (
//     <>
//       <CKEditor
//         editor={ClassicEditor}
//         editorWatchdog={watchdog}
//         config={editorConfig}
//         data={value}
//         onInit={editor => { editorRef.current = editor; registerButtons(editor); }}
//         onChange={(_,editor) => onChange(editor.getData())}
//         onError={({ willEditorRestart }) => { if (willEditorRestart) editorRef.current = null; }}
//       />
//       {modalType && <FormModal type={modalType} onSubmit={handleInsert} onClose={() => setModalType(null)} />}
//     </>
//   );
// };

// export default WirisRichTextEditor;
