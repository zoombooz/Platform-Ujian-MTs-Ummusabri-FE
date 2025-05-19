import { useState } from 'react';
// import RichTextEditor from './RichTextEditor';
import RichTextEditorV2 from './RichTextEditorV2';
// import RichTextEditorV3 from './RichTextEditorV3';
import RichTextEditorV4 from './RichTextEditorV4';
import WirisCKEditor from './WirisTextEditorV3/wiris-ckeditor5';
interface WysiwygAreaProps {
    content?: string,
    onChange?: (value: string) => void,
}


export default function WysiwygArea({content, onChange}: WysiwygAreaProps) {
    const [description, setDescription] = useState<string>(content || '');

    const handleContentChange = (value: string) => {
        try {
            setDescription(value);
            console.log("value", value);
            if(onChange) onChange(value);
            
        } catch (error) {
            alert("error on wysiwyg", error);
            console.log("error on wysiwyg", error);
        }
        
    };

    return (
        <div>
            {/* <RichTextEditorV2 key="quill-editor" value={description} onChange={handleContentChange} /> */}
            {/* <RichTextEditorV4 value={description} onChange={handleContentChange} /> */}
            <WirisCKEditor
                initialData={description}
                onChange={handleContentChange}
                height={400}
                placeholder="Type or insert math equation..."
            />
            <input type="hidden" name="description" value={description} />
        </div>
    );
};