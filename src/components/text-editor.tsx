import {useEffect, useState} from 'react';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";

const theme = {
    paragraph: "mb-2 text-black",
    heading: {
    h1: "text-2xl font-bold text-gray-900",
    h2: "text-xl font-semibold text-gray-900",
    h3: "text-lg font-medium text-gray-800",
    },
    list: {
    nested: {
        listitem: "ml-5 list-disc",
    },
    ol: "list-decimal pl-5",
    ul: "list-disc pl-5",
    listitem: "mb-1",
    },
    bold: "font-bold text-gray-900",
    italic: "italic text-gray-800",
    underline: "underline text-gray-800",
    strikethrough: "line-through text-black",
    code: "bg-gray-100 text-red-500 px-1 rounded",    
}
  
  // Catch any errors that occur during Lexical updates and log them
  // or throw them as needed. If you don't throw them, Lexical will
  // try to recover gracefully without losing user data.

export function TextEditor() {
    const [editorState, setEditorState] = useState<EditorState | null>(null);

    const initialConfig = {
        namespace: 'MyEditor',
        theme: theme,
        onError: (error: Error) => console.error(error),
    };
    
    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <LexicalComposer initialConfig={initialConfig}>
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                        aria-placeholder={'Enter some text...'}
                        placeholder={<div>Enter some text...</div>}
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
            </LexicalComposer>
        </div>
    );
}