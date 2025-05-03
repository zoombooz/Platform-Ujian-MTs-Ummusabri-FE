import React from 'react';
import styles from './ArabicTextWrapper.module.css'

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+/g;

interface ArabicTextWrapperProps {
    text: string;
}

const ArabicTextWrapper: React.FC<ArabicTextWrapperProps> = ({ text }) => {
    const parts = [];
    let lastIndex = 0;

    // Match Arabic parts and split
    text.replace(arabicRegex, (match, index) => {
        if (lastIndex !== index) {
        parts.push({ type: 'text', content: text.slice(lastIndex, index) });
        }
        parts.push({ type: 'arabic', content: match });
        lastIndex = index + match.length;
        return match;
    });

    // Push any remaining text after the last match
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return (
        <>
        {parts.map((part, i) =>
            part.type === 'arabic' ? (
            <span key={i} className={styles.arabic_text}>
                {part.content}
            </span>
            ) : (
            <span key={i}>{part.content}</span>
            )
        )}
        </>
    );
};

export default ArabicTextWrapper;
