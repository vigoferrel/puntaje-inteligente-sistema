
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface SafeMarkdownProps {
  children: string;
  className?: string;
}

/**
 * Wrapper seguro para ReactMarkdown que maneja className correctamente
 */
export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ children, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};
