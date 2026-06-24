/**
 * useCanvasOptimization Hook
 * Memoizes expensive canvas calculations
 */

import { useMemo, useCallback } from 'react';
import { CanvasElement } from '../App';

export function useCanvasOptimization(
  elements: CanvasElement[],
  selectedId: string | null,
  canvasWidth: number,
  canvasHeight: number
) {
  /**
   * Memoize selected element lookup (O(n) operation)
   */
  const selectedElement = useMemo(
    () => elements.find((el) => el.id === selectedId) || null,
    [elements, selectedId]
  );

  /**
   * Memoize element bounding boxes for resize calculations
   */
  const elementBounds = useMemo(() => {
    return elements.map((el) => ({
      id: el.id,
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
      right: el.x + el.width,
      bottom: el.y + el.height,
    }));
  }, [elements]);

  /**
   * Memoize canvas area for hit detection
   */
  const canvasBounds = useMemo(
    () => ({
      width: canvasWidth,
      height: canvasHeight,
      maxX: canvasWidth,
      maxY: canvasHeight,
    }),
    [canvasWidth, canvasHeight]
  );

  /**
   * Memoize element count for statistics
   */
  const elementStats = useMemo(
    () => ({
      total: elements.length,
      images: elements.filter((el) => el.type === 'image').length,
      texts: elements.filter((el) => el.type === 'text').length,
      shapes: elements.filter((el) => el.type === 'rect' || el.type === 'circle').length,
    }),
    [elements]
  );

  return {
    selectedElement,
    elementBounds,
    canvasBounds,
    elementStats,
  };
}

/**
 * Memoized position constraint calculator
 * Prevents recalculation of pan boundaries on every render
 */
export const calculatePanConstraints = (
  elementWidth: number,
  elementHeight: number,
  canvasWidth: number,
  canvasHeight: number
) => ({
  minX: -elementWidth / 2,
  maxX: canvasWidth + elementWidth / 2,
  minY: -elementHeight / 2,
  maxY: canvasHeight + elementHeight / 2,
});

/**
 * Efficient element collision detection
 * Returns true if element at (x, y) collides with existing elements
 */
export const detectElementCollision = (
  x: number,
  y: number,
  width: number,
  height: number,
  bounds: Array<{ x: number; y: number; width: number; height: number }>
): boolean => {
  return bounds.some((bound) => {
    return (
      x < bound.x + bound.width &&
      x + width > bound.x &&
      y < bound.y + bound.height &&
      y + height > bound.y
    );
  });
};
