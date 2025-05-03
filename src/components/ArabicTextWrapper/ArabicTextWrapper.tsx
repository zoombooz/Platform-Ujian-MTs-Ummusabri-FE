import React from 'react';
import styles from './ArabicTextWrapper.module.css'

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g;

interface ArabicTextWrapperProps {
    text: string;
}

const ArabicTextWrapper: React.FC<ArabicTextWrapperProps> = ({ text }) => {
    const parts = [];
    let lastIndex = 0;
    // Add a style for <ol> elements based on data-list attribute
    
    // $SELECTION_PLACEHOLDER$
    const dataListMatch = text.match(/data-list\s*=\s*"([^"]*)"/);
    const dataListValue = dataListMatch ? dataListMatch[1] : '';
    // console.log("data-list match:", dataListMatch);
    // console.log("data-list value:", dataListValue);

    if(dataListValue == 'bullet') {
        text = text.replace(/<ol[^>]*>/g, '<ul class="bullet">');
        text = text.replace(/<\/ol>/g, '</ul>');
    }
    const addClassesToListItems = (text:string) => {
        console.log("TEST")
        return text.replace(/<li data-list="([^"]+)">([^<]+)<\/li>/g, (__, listType:any, content:any) => {
            // console.log("Replace Prop: ", {listType, content})
            return `<li data-list="${listType}" class="${listType === 'bullet' ? 'list-disc' : 'list-decimal'}">${content}</li>`;
        });
      };

    text = addClassesToListItems(text);
    text = text.replace(/\s+/g, ' ').trim();
    // Match Arabic parts and split
    text.replace(arabicRegex, (match, index) => {
        if (lastIndex !== index) {
            parts.push({ type: 'text', content: text.slice(lastIndex, index).trim() });
        }
        parts.push({ type: 'arabic', content: match.trim() });
        lastIndex = index + match.length;
        return match;
    });
    
    // console.log("New Text: ", text)
    // Push any remaining text after the last match
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.slice(lastIndex).trim() });
    }

    return (
        <>
        {parts.map((part, i) =>
            part.type === 'arabic' ? (
            <span key={i} className={styles.arabic_text} dangerouslySetInnerHTML={{__html:part.content}}>
                {/* {part.content} */}
            </span>
            ) : (
            <span key={i} dangerouslySetInnerHTML={{__html:part.content}}></span>
            )
        )}
        </>
    );
};

export default ArabicTextWrapper;
