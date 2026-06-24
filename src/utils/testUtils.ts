/**
 * Test Utilities & Helpers
 * Shared testing utilities for unit and integration tests
 */

import { CanvasElement, SavedProject } from '../App';

/**
 * Mock CanvasElement factory
 */
export const createMockElement = (overrides?: Partial<CanvasElement>): CanvasElement => ({
  id: `elem-${Math.random().toString(36).substr(2, 9)}`,
  type: 'image',
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  color: '#000000',
  fontSize: 16,
  fontFamily: 'sans-serif',
  text: 'Sample Text',
  ...overrides,
});

/**
 * Mock SavedProject factory
 */
export const createMockProject = (overrides?: Partial<SavedProject>): SavedProject => ({
  id: `proj-${Date.now()}`,
  name: `Test Project ${Date.now()}`,
  width: 1080,
  height: 1080,
  elements: [createMockElement()],
  imageUrl: 'data:image/png;base64,...',
  savedAt: new Date().toISOString(),
  ...overrides,
});

/**
 * Mock localStorage for testing
 */
export class MockLocalStorage {
  private store = new Map<string, string>();

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  get length(): number {
    return this.store.size;
  }
}

/**
 * Test data generators
 */
export const testData = {
  /**
   * Generate N canvas elements
   */
  generateElements: (count: number): CanvasElement[] => {
    return Array.from({ length: count }, (_, i) =>
      createMockElement({
        id: `elem-${i}`,
        x: i * 50,
        y: i * 50,
        type: i % 3 === 0 ? 'text' : i % 3 === 1 ? 'rect' : 'image',
      })
    );
  },

  /**
   * Generate N projects
   */
  generateProjects: (count: number): SavedProject[] => {
    return Array.from({ length: count }, (_, i) =>
      createMockProject({
        id: `proj-${i}`,
        name: `Project ${i + 1}`,
        elements: testData.generateElements(3 + i),
      })
    );
  },

  /**
   * Sample large file for testing
   */
  largeImageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
};

/**
 * Assertion helpers
 */
export const assertions = {
  /**
   * Check if element is within canvas bounds
   */
  isWithinBounds: (el: CanvasElement, canvasWidth: number, canvasHeight: number): boolean => {
    return el.x >= 0 && el.y >= 0 && el.x + el.width <= canvasWidth && el.y + el.height <= canvasHeight;
  },

  /**
   * Check if two elements collide
   */
  elementsCollide: (el1: CanvasElement, el2: CanvasElement): boolean => {
    return (
      el1.x < el2.x + el2.width &&
      el1.x + el1.width > el2.x &&
      el1.y < el2.y + el2.height &&
      el1.y + el1.height > el2.y
    );
  },

  /**
   * Validate project structure
   */
  isValidProject: (project: any): project is SavedProject => {
    return (
      project.id &&
      typeof project.id === 'string' &&
      project.name &&
      typeof project.name === 'string' &&
      project.width &&
      typeof project.width === 'number' &&
      project.height &&
      typeof project.height === 'number' &&
      Array.isArray(project.elements) &&
      project.savedAt &&
      typeof project.savedAt === 'string'
    );
  },

  /**
   * Validate element structure
   */
  isValidElement: (element: any): element is CanvasElement => {
    return (
      element.id &&
      typeof element.id === 'string' &&
      ['image', 'text', 'rect', 'circle'].includes(element.type) &&
      typeof element.x === 'number' &&
      typeof element.y === 'number' &&
      typeof element.width === 'number' &&
      typeof element.height === 'number'
    );
  },
};

/**
 * Event simulation helpers
 */
export const eventHelpers = {
  /**
   * Create a mouse event
   */
  createMouseEvent: (type: string, options?: Partial<MouseEventInit>): MouseEvent => {
    return new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: 0,
      clientY: 0,
      ...options,
    });
  },

  /**
   * Create a drag event
   */
  createDragEvent: (type: string, x: number, y: number, options?: Partial<DragEventInit>): DragEvent => {
    return new DragEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      ...options,
    });
  },

  /**
   * Create a keyboard event
   */
  createKeyboardEvent: (type: string, key: string, options?: Partial<KeyboardEventInit>): KeyboardEvent => {
    return new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      key,
      ...options,
    });
  },
};

export default {
  createMockElement,
  createMockProject,
  MockLocalStorage,
  testData,
  assertions,
  eventHelpers,
};
