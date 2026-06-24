# Testing & Type Safety Guide

## 🧪 Testing Setup

### Test Framework: Vitest

- **Why Vitest?** Fast, TypeScript-native, compatible with Jest syntax
- **Configuration:** `vite.config.ts` includes vitest config
- **Speed:** 5-10x faster than Jest for small-to-medium projects

### Installation & Configuration

```bash
npm install -D vitest @vitest/ui happy-dom @testing-library/react
```

**vite.config.ts:**

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom", // Lightweight DOM environment
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/test/"],
    },
  },
});
```

## 📝 Test File Structure

### Location Pattern

```
src/
├── utils/
│   ├── validation.ts
│   └── __tests__/
│       └── validation.test.ts  ← Test file next to source
├── hooks/
│   └── __tests__/
│       └── useAppState.test.ts
└── components/
    └── __tests__/
        └── Header.test.tsx
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode (auto-rerun on changes)
npm run test:watch

# UI mode (visual test runner)
npm run test:ui

# Coverage report
npm run test:coverage
```

## 🧬 Test Examples

### Unit Test - Validation Functions

```typescript
import { describe, it, expect } from "vitest";
import { validateCanvasSize, LIMITS } from "../validation";

describe("validateCanvasSize", () => {
  it("should accept valid dimensions", () => {
    const result = validateCanvasSize(1080, 1080);
    expect(result.valid).toBe(true);
  });

  it("should reject dimensions below minimum", () => {
    const result = validateCanvasSize(50, 50);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Minimum");
  });
});
```

### Component Test - Header

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

describe('Header Component', () => {
  it('renders save button in editor mode', () => {
    render(
      <Header
        currentView="editor"
        onSave={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.getByText('💾 Ayarları Kaydet')).toBeInTheDocument();
  });

  it('hides buttons in dashboard mode', () => {
    render(
      <Header
        currentView="dashboard"
        onSave={vi.fn()}
        onClear={vi.fn()}
      />
    );
    expect(screen.queryByText('💾 Ayarları Kaydet')).not.toBeInTheDocument();
  });
});
```

### Hook Test - useAppState

```typescript
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useAppState } from "../useAppState";

describe("useAppState Hook", () => {
  it("initializes with empty elements", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.elements).toEqual([]);
  });

  it("can add and remove elements", () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.setElements([{ id: "1", type: "image" }]);
    });

    expect(result.current.elements).toHaveLength(1);
  });
});
```

## 🔒 Type Safety Improvements

### 1. **Enable Strict Mode in tsconfig.json**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true
  }
}
```

### 2. **Type Definitions for App**

**src/types/index.ts:**

```typescript
export interface CanvasElement {
  id: string;
  type: "image" | "text" | "rect" | "circle";
  x: number;
  y: number;
  width: number;
  height: number;
  src?: string;
  color: string;
  fontSize?: number;
  fontFamily?: string;
  text?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  width: number;
  height: number;
  elements: CanvasElement[];
  imageUrl?: string;
  savedAt: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}
```

### 3. **Non-null Assertions (Use Sparingly)**

```typescript
// ✅ Good: null check first
const element = elements.find((el) => el.id === selectedId);
if (element) {
  updateElement(element);
}

// ❌ Avoid: Force non-null
const element = elements.find((el) => el.id === selectedId)!;
updateElement(element); // May crash if undefined

// ⚠️ Acceptable: When you're 100% certain
const canvas = document.getElementById("canvas")!; // Known to exist
```

### 4. **Exhaustiveness Checking**

```typescript
// Force handling all cases
function getElementIcon(type: CanvasElement["type"]): string {
  switch (type) {
    case "image":
      return "🖼️";
    case "text":
      return "📝";
    case "rect":
      return "▭";
    case "circle":
      return "●";
    default:
      const exhaustive: never = type;
      return exhaustive; // TS Error if case missing
  }
}
```

### 5. **Generic Types**

```typescript
// Reusable hook for state management
function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  return [state, setState] as const;
}

// Usage with type inference
const [projects, setProjects] = useLocalStorage<SavedProject[]>("projects", []);
```

## ✅ Type Safety Checklist

- [ ] No `any` types without comment explaining why
- [ ] All functions have return types specified
- [ ] All parameters have types specified
- [ ] Strict mode enabled in tsconfig
- [ ] No unused imports/variables
- [ ] All async functions properly awaited
- [ ] Null/undefined checked before use
- [ ] Props interfaces properly defined
- [ ] Type-only imports use `import type` syntax
- [ ] Tests cover happy path and error cases

## 📊 Coverage Goals

```
Statements   : 80%+ coverage
Branches     : 70%+ coverage
Functions    : 80%+ coverage
Lines        : 80%+ coverage
```

**Target files for testing:**

1. ✅ `validation.ts` - 100% (all branches)
2. ✅ `imageCompression.ts` - 80%+ (main functions)
3. ⏳ `useAppState.ts` - 70%+ (hook logic)
4. ⏳ `CanvasArea.tsx` - 60%+ (complex component)
5. ⏳ `PropertiesPanel.tsx` - 70%+ (UI interactions)

## 🔍 Linting & Formatting

### ESLint Configuration

```bash
npm install -D eslint eslint-plugin-react eslint-plugin-@typescript-eslint
```

**eslintrc.json:**

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended"
  ],
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### Prettier Formatting

```bash
npm install -D prettier
```

**prettier.json:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

## 🎯 Next Steps

1. **Run first test suite:** `npm run test src/utils/__tests__/validation.test.ts`
2. **Check coverage:** `npm run test:coverage`
3. **Fix type errors:** Address any `@ts-expect-error` comments
4. **Add more tests:** Aim for 80%+ coverage on critical paths
5. **Enable strict checks:** Gradually enable stricter TS rules

---

For test utilities, see: `testUtils.ts`
For example tests, see: `validation.test.ts`
