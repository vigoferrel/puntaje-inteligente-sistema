/* eslint-disable react-refresh/only-export-components */
import { ComponentProps, FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

/**
 * COMPONENTE BASE LAYOUT v2.0
 * Layout base adaptativo para diferentes experiencias
 */

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LayoutType, BaseEducationalComponentProps } from '../../types/ui-components';

interface BaseLayoutProps extends BaseEducationalComponentProps {
  type: LayoutType;
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  navigation?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const BaseLayout: FC<BaseLayoutProps> = ({
  children,
  className,
  type,
  header,
  sidebar,
  footer,
  navigation,
  maxWidth = 'full',
  centered = false,
  padding = 'md',
  cinematicProps,
  ...props
}) => {
  const containerClasses = cn(
    'min-h-screen',
    {
      'max-w-sm': maxWidth === 'sm',
      'max-w-md': maxWidth === 'md',
      'max-w-lg': maxWidth === 'lg',
      'max-w-xl': maxWidth === 'xl',
      'max-w-2xl': maxWidth === '2xl',
      'max-w-full': maxWidth === 'full',
      'mx-auto': centered,
      'p-2': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
      'p-8': padding === 'xl'
    },
    className
  );

  const renderLayout = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className={cn('flex h-screen', containerClasses)}>
            {sidebar && (
              <aside className="w-64 bg-card border-r border-border">
                {sidebar}
              </aside>
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
              {header && (
                <header className="bg-card border-b border-border">
                  {header}
                </header>
              )}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
              {footer && (
                <footer className="bg-card border-t border-border">
                  {footer}
                </footer>
              )}
            </div>
          </div>
        );

      case 'immersive':
        return (
          <div className={cn('relative overflow-hidden', containerClasses)}>
            {navigation && (
              <nav className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
                {navigation}
              </nav>
            )}
            <main className="relative z-10">
              {children}
            </main>
            {footer && (
              <footer className="absolute bottom-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
                {footer}
              </footer>
            )}
          </div>
        );

      case 'fullscreen':
        return (
          <div className="fixed inset-0 z-50 bg-background">
            {children}
          </div>
        );

      case 'modal':
        return (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              {children}
            </div>
          </div>
        );

      default:
        return (
          <div className={containerClasses}>
            {header && header}
            <main>{children}</main>
            {footer && footer}
          </div>
        );
    }
  };

  const layoutContent = renderLayout();

  if (cinematicProps?.enableTransitions !== false) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {layoutContent}
      </motion.div>
    );
  }

  return layoutContent;
};

