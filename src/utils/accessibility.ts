/**
 * Accessibility Utilities
 * ARIA labels, screen reader support, semantic HTML helpers
 */

export const a11y = {
  /**
   * Generate unique ARIA IDs for form labels and descriptions
   */
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,

  /**
   * Announce messages to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  /**
   * Common ARIA labels for UI elements
   */
  labels: {
    save: 'Ayarları kaydet (Ctrl+S)',
    delete: 'Seçili öğeyi sil (Delete)',
    undo: 'Geri al (Ctrl+Z)',
    redo: 'İleri al (Ctrl+Shift+Z)',
    selectImage: 'Görsel seçin veya buraya sürükleyin',
    canvas: 'Düzenleme canvas\'ı, elementler burada gösterilir',
    properties: 'Seçili öğe özellikleri',
    colorPicker: 'Renk seç',
    fontFamily: 'Yazı tipini seç',
    fontSize: 'Yazı boyutunu seç (piksel)',
    projectName: 'Proje adı',
    projectList: 'Kaydedilen projeler listesi',
    deleteProject: 'Projeyi sil',
    openProject: 'Projeyi aç',
    canvasWidth: 'Canvas genişliği (piksel)',
    canvasHeight: 'Canvas yüksekliği (piksel)',
  },

  /**
   * Common ARIA descriptions for complex interactions
   */
  descriptions: {
    dragResize: 'Sürükleyerek boyutunu değiştirin, köşelere getirin',
    dragElement: 'Elementyi sürükleyerek taşıyın',
    panImage: 'Görseli pan yapmak için sürükleyin, kenar dışına çıkabilirsiniz',
  },
};

/**
 * Helper component for screen-reader-only text
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only" role="status" aria-live="polite">
      {children}
    </span>
  );
}

/**
 * Make buttons keyboard-accessible with Tab support
 */
export const keyboardA11y = {
  button: {
    role: 'button',
    tabIndex: 0,
    'aria-pressed': false,
  } as React.ButtonHTMLAttributes<HTMLButtonElement>,

  link: {
    role: 'link',
    tabIndex: 0,
  },
};
