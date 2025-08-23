/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import ReactMarkdown from 'react-markdown';

interface SafeMarkdownProps {
  children: string;
  className?: string;
}

/**
 * Wrapper seguro para ReactMarkdown que maneja className correctamente
 */
export const SafeMarkdown: FC<SafeMarkdownProps> = ({ children, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
};

