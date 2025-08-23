/* eslint-disable react-refresh/only-export-components */
// VIRTUALIZED LIST - Componente optimizado con Context7
// Lista virtualizada para renderizado eficiente de grandes datasets

import React from 'react';
import { useVirtualList } from '../../ui/hooks/performance/useVirtualList';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

export (...args: unknown[]) => unknown VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll
}: VirtualizedListProps<T>) {
  const {
    virtualItems,
    containerProps,
    innerProps,
    isScrolling
  } = useVirtualList(items, {
    itemHeight,
    containerHeight,
    overscan
  });

  // Manejar scroll personalizado
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (onScroll) {
      onScroll(event.currentTarget.scrollTop);
    }
    containerProps.onScroll?.(event);
  };

  return (
    <div
      {...containerProps}
      className={irtualized-list  }
      onScroll={handleScroll}
      data-virtual-container
    >
      <div {...innerProps}>
        {virtualItems.map(({ index, style }) => (
          <div
            key={index}
            className="dynamic-style-prop" data-style-ref="style"
            className="virtual-item"
          >
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para grids virtualizados
interface VirtualizedGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  containerHeight: number;
  columnsCount: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

export (...args: unknown[]) => unknown VirtualizedGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
  columnsCount,
  renderItem,
  className = '',
  overscan = 5
}: VirtualizedGridProps<T>) {
  const {
    virtualItems,
    containerProps,
    innerProps
  } = useVirtualGrid(items, {
    itemWidth,
    itemHeight,
    containerWidth,
    containerHeight,
    columnsCount,
    overscan
  });

  return (
    <div
      {...containerProps}
      className={irtualized-grid }
    >
      <div {...innerProps}>
        {virtualItems.map(({ index, style }) => (
          <div
            key={index}
            className="dynamic-style-prop" data-style-ref="style"
            className="virtual-grid-item"
          >
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Hook para usar virtual grid
import { useVirtualGrid } from '../../ui/hooks/performance/useVirtualList';



