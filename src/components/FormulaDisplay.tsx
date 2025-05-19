// FormulaDisplay.tsx (Komponen untuk menampilkan persamaan)
import React, { useEffect, useRef } from 'react';
import { init, render } from '@wiris/mathtype-html-integration-devkit';

interface FormulaDisplayProps {
  html: string;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ html }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      init().then(() => {
        render(containerRef.current!);
      });
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="formula-display"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default FormulaDisplay;