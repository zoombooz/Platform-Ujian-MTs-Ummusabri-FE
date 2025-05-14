import { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import RichTextEditorV2 from './RichTextEditorV2';
interface WysiwygAreaProps {
    content?: string,
    onChange?: (value: string) => void,
}


export default function WysiwygArea({content, onChange}: WysiwygAreaProps) {
    const [description, setDescription] = useState<string>(content || '');

    const handleContentChange = (value: string) => {
        setDescription(value);
        if(onChange) onChange(value);
        
    };

    return (
        <div>
            <RichTextEditorV2 key="quill-editor" value={description} onChange={handleContentChange} />
            <input type="hidden" name="description" value={description} />
        </div>
    );
};