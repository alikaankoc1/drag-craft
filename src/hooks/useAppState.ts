/**
 * useAppState Hook
 * App bileşeninin state mantığını ayırır, daha clean ve reusable yapar
 */

import { useState, useCallback } from 'react';
import type { CanvasElement, SavedProject } from '../App';
import { safeLocalStorage } from '../utils/validation';
import { useToast } from '../assets/components/ToastProvider';

export function useAppState() {
  const toast = useToast();
  
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(1080);
  const [canvasHeight, setCanvasHeight] = useState<number>(1080);
  const [currentView, setCurrentView] = useState<'editor' | 'dashboard' | 'history'>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [customWidth, setCustomWidth] = useState<string>('1080');
  const [customHeight, setCustomHeight] = useState<string>('1080');
  
  const [projects, setProjects] = useState<SavedProject[]>(() => {
    const result = safeLocalStorage<SavedProject[]>('get', 'img_resizer_projects');
    if (result.success && result.data) {
      return result.data;
    }
    return [];
  });

  const saveProjectsToStorage = useCallback((updatedProjects: SavedProject[]) => {
    setProjects(updatedProjects);
    const result = safeLocalStorage('set', 'img_resizer_projects', updatedProjects);
    if (!result.success) {
      toast.show(`Kayıt hatası: ${result.error}`);
      console.error('Failed to save projects:', result.error);
    }
  }, [toast]);

  const handleClear = useCallback(() => {
    setElements([]);
    setSelectedId(null);
    setCurrentProjectId(null);
  }, []);

  return {
    // Elements & Canvas
    elements,
    setElements,
    selectedId,
    setSelectedId,
    canvasWidth,
    setCanvasWidth,
    canvasHeight,
    setCanvasHeight,
    
    // Views & Projects
    currentView,
    setCurrentView,
    currentProjectId,
    setCurrentProjectId,
    customWidth,
    setCustomWidth,
    customHeight,
    setCustomHeight,
    
    // Projects
    projects,
    setProjects,
    saveProjectsToStorage,
    
    // Actions
    handleClear,
  };
}
