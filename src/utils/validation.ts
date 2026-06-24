/**
 * Input Validation Utilities
 * Uygulamanın güvenli ve tutarlı kalması için validation fonksiyonları
 */

export const LIMITS = {
  MIN_CANVAS_SIZE: 100,
  MAX_CANVAS_SIZE: 4000,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MIN_ELEMENT_SIZE: 24,
  MAX_PROJECT_NAME_LENGTH: 100,
};

/**
 * Canvas boyutlarını doğrula
 */
export function validateCanvasSize(width: number, height: number): { valid: boolean; error?: string } {
  if (width < LIMITS.MIN_CANVAS_SIZE || height < LIMITS.MIN_CANVAS_SIZE) {
    return {
      valid: false,
      error: `Minimum canvas boyutu ${LIMITS.MIN_CANVAS_SIZE}x${LIMITS.MIN_CANVAS_SIZE}px olmalıdır.`,
    };
  }

  if (width > LIMITS.MAX_CANVAS_SIZE || height > LIMITS.MAX_CANVAS_SIZE) {
    return {
      valid: false,
      error: `Maximum canvas boyutu ${LIMITS.MAX_CANVAS_SIZE}x${LIMITS.MAX_CANVAS_SIZE}px olmalıdır.`,
    };
  }

  return { valid: true };
}

/**
 * File boyutunu doğrula
 */
export function validateFileSize(file: File): { valid: boolean; error?: string } {
  if (file.size > LIMITS.MAX_FILE_SIZE) {
    const sizeMB = (LIMITS.MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `Dosya boyutu ${sizeMB}MB'dan küçük olmalıdır. Dosya: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Dosya tipini doğrula
 */
export function validateFileType(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Desteklenmeyen dosya türü. İzin verilenler: PNG, JPEG, WEBP. Dosya: ${file.type}`,
    };
  }

  return { valid: true };
}

/**
 * Proje adını doğrula
 */
export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Proje adı boş olamaz.' };
  }

  if (name.length > LIMITS.MAX_PROJECT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Proje adı ${LIMITS.MAX_PROJECT_NAME_LENGTH} karakterden kısa olmalıdır.`,
    };
  }

  return { valid: true };
}

/**
 * LocalStorage operasyonlarını güvenli şekilde çalıştır
 */
export function safeLocalStorage<T>(
  operation: 'set' | 'get',
  key: string,
  value?: T
): { success: boolean; data?: T; error?: string } {
  try {
    if (operation === 'set' && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
      return { success: true };
    }

    if (operation === 'get') {
      const item = localStorage.getItem(key);
      if (!item) return { success: true, data: undefined };
      const parsed = JSON.parse(item) as T;
      return { success: true, data: parsed };
    }

    return { success: false, error: 'Invalid operation' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`LocalStorage error (${operation}):`, message);
    return {
      success: false,
      error: `LocalStorage hatası: ${message}`,
    };
  }
}
