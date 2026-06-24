/**
 * Example Test Suite - Validation Functions
 * Demonstrates testing patterns for the app
 * 
 * To run tests:
 *   npm run test
 * 
 * Uses Vitest + Happy DOM for fast unit testing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateCanvasSize,
  validateFileSize,
  validateFileType,
  validateProjectName,
  LIMITS,
} from '../validation';

describe('Validation Functions', () => {
  describe('validateCanvasSize', () => {
    it('should accept valid canvas dimensions', () => {
      const result = validateCanvasSize(1080, 1080);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject canvas smaller than minimum', () => {
      const result = validateCanvasSize(50, 50);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Minimum');
    });

    it('should reject canvas larger than maximum', () => {
      const result = validateCanvasSize(5000, 5000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Maximum');
    });

    it('should have symmetric bounds', () => {
      const min = validateCanvasSize(LIMITS.MIN_CANVAS_SIZE, LIMITS.MIN_CANVAS_SIZE);
      const max = validateCanvasSize(LIMITS.MAX_CANVAS_SIZE, LIMITS.MAX_CANVAS_SIZE);
      expect(min.valid).toBe(true);
      expect(max.valid).toBe(true);
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under size limit', () => {
      const file = new File(['x'.repeat(1000)], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(true);
    });

    it('should reject files over size limit', () => {
      // Create a file larger than MAX_FILE_SIZE
      const largeData = new Array(LIMITS.MAX_FILE_SIZE + 1).fill('x');
      const file = new File(largeData, 'large.jpg', { type: 'image/jpeg' });
      const result = validateFileSize(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File size');
    });
  });

  describe('validateFileType', () => {
    it('should accept JPEG files', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = validateFileType(file);
      expect(result.valid).toBe(true);
    });

    it('should accept PNG files', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      const result = validateFileType(file);
      expect(result.valid).toBe(true);
    });

    it('should accept WEBP files', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      const result = validateFileType(file);
      expect(result.valid).toBe(true);
    });

    it('should reject unsupported file types', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      const result = validateFileType(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File type');
    });

    it('should reject GIF files', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      const result = validateFileType(file);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateProjectName', () => {
    it('should accept valid project names', () => {
      const result = validateProjectName('My Project');
      expect(result.valid).toBe(true);
    });

    it('should reject empty names', () => {
      const result = validateProjectName('');
      expect(result.valid).toBe(false);
    });

    it('should reject names exceeding max length', () => {
      const longName = 'x'.repeat(LIMITS.MAX_PROJECT_NAME_LENGTH + 1);
      const result = validateProjectName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('length');
    });

    it('should accept max length names', () => {
      const maxName = 'x'.repeat(LIMITS.MAX_PROJECT_NAME_LENGTH);
      const result = validateProjectName(maxName);
      expect(result.valid).toBe(true);
    });

    it('should handle special characters', () => {
      const result = validateProjectName('Project #123 (Proje)');
      expect(result.valid).toBe(true);
    });
  });
});

describe('LIMITS Constants', () => {
  it('should have reasonable bounds', () => {
    expect(LIMITS.MIN_CANVAS_SIZE).toBeLessThan(LIMITS.MAX_CANVAS_SIZE);
    expect(LIMITS.MIN_ELEMENT_SIZE).toBeGreaterThan(0);
    expect(LIMITS.MAX_FILE_SIZE).toBeGreaterThan(0);
    expect(LIMITS.MAX_PROJECT_NAME_LENGTH).toBeGreaterThan(0);
  });

  it('should have sensible values', () => {
    expect(LIMITS.MIN_CANVAS_SIZE).toBeGreaterThanOrEqual(100);
    expect(LIMITS.MAX_CANVAS_SIZE).toBeLessThanOrEqual(4000);
    expect(LIMITS.MAX_FILE_SIZE).toBeGreaterThanOrEqual(10 * 1024 * 1024); // At least 10MB
  });
});
