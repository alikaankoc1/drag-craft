/**
 * Image Compression & Optimization Utilities
 * Handles image resizing, compression, and format conversion
 */

const COMPRESSION_SETTINGS = {
  JPEG_QUALITY: 0.85, // 85% quality (balance between quality and size)
  PNG_QUALITY: 0.9, // PNG uses 90%
  MAX_WIDTH: 4000, // Maximum export width
  MAX_HEIGHT: 4000, // Maximum export height
  THUMBNAIL_SIZE: 200, // Size for preview thumbnails
};

/**
 * Compress image using Canvas API
 * Reduces file size by adjusting quality and format
 */
export async function compressImage(
  imageSrc: string,
  format: 'jpeg' | 'png' | 'webp' = 'jpeg',
  quality: number = COMPRESSION_SETTINGS.JPEG_QUALITY
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);

      try {
        const mimeType = `image/${format}`;
        const compressed = canvas.toDataURL(mimeType, quality);
        resolve(compressed);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    img.src = imageSrc;
  });
}

/**
 * Resize image to fit within max dimensions
 * Maintains aspect ratio
 */
export async function resizeImage(
  imageSrc: string,
  maxWidth: number = COMPRESSION_SETTINGS.MAX_WIDTH,
  maxHeight: number = COMPRESSION_SETTINGS.MAX_HEIGHT
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      try {
        const resized = canvas.toDataURL('image/jpeg', COMPRESSION_SETTINGS.JPEG_QUALITY);
        resolve(resized);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = imageSrc;
  });
}

/**
 * Create thumbnail preview of image
 * Useful for project list previews
 */
export async function createThumbnail(
  imageSrc: string,
  size: number = COMPRESSION_SETTINGS.THUMBNAIL_SIZE
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = img.width / img.height;

      if (ratio > 1) {
        // Landscape
        canvas.width = size;
        canvas.height = size / ratio;
      } else {
        // Portrait
        canvas.width = size * ratio;
        canvas.height = size;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const thumbnail = canvas.toDataURL('image/jpeg', COMPRESSION_SETTINGS.JPEG_QUALITY);
        resolve(thumbnail);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for thumbnail'));
    };

    img.src = imageSrc;
  });
}

/**
 * Calculate file size reduction percentage
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Format file size for display (bytes → KB/MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export { COMPRESSION_SETTINGS };
