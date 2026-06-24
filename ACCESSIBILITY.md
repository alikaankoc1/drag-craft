# Keyboard Shortcuts & Accessibility Guide

## ⌨️ Keyboard Shortcuts

The application now supports several keyboard shortcuts for faster workflow:

| Shortcut                                                                                                | Action                   | Notes                                              |
| ------------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------------------------- |
| <kbd>Ctrl</kbd> + <kbd>S</kbd> (or <kbd>Cmd</kbd> + <kbd>S</kbd>)                                       | Save Project             | Saves the current project to LocalStorage          |
| <kbd>Delete</kbd> or <kbd>Backspace</kbd>                                                               | Delete Selected          | Removes the currently selected element from canvas |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> (or <kbd>Cmd</kbd> + <kbd>Z</kbd>)                                       | Undo                     | Reverts the last action (when implemented)         |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>) | Redo                     | Re-applies an undone action (when implemented)     |
| <kbd>Ctrl</kbd> + <kbd>A</kbd> (or <kbd>Cmd</kbd> + <kbd>A</kbd>)                                       | Select All               | Selects all elements on canvas (when implemented)  |
| <kbd>Tab</kbd>                                                                                          | Focus Navigation         | Move focus between interactive elements            |
| <kbd>Enter</kbd>                                                                                        | Activate Focused Element | Triggers button clicks or form submissions         |

## ♿ Accessibility Features

### Screen Reader Support

- **ARIA Labels**: All interactive elements have descriptive `aria-label` attributes
- **ARIA Live Regions**: Real-time announcements for actions (saves, deletions, uploads)
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<aside>`, `role="banner"`, `role="main"`, etc.
- **Focus Management**: Tab order is logical and keyboard-navigable

### Visual Accessibility

- **Focus Indicators**: All interactive elements show focus rings
- **Color Contrast**: Colors meet WCAG AA standards
- **Font Sizes**: Readable text throughout the UI
- **SVG/Icon Labels**: Icons have `aria-hidden="true"` when decorative

### Form Accessibility

- **Label Association**: `<label>` elements properly linked to `<input>` with `htmlFor`
- **Input Descriptions**: Hints provided for min/max values
- **Error Messages**: Clear, descriptive error toasts

### Canvas Accessibility

- Canvas element has `aria-label` describing it as an editing area
- Selected elements have visual focus rings
- Resize handles have descriptive cursor titles

### Navigation

- **Sidebar**: Buttons clearly labeled for view switching
- **Header**: Logo and title in semantic header with banner role
- **Properties Panel**: Complementary role with descriptive labels

## 🎯 Best Practices

1. **Use keyboard shortcuts** when possible for faster workflow
2. **Screen readers recommended** for users with visual impairments
3. **Tab through the UI** to navigate without mouse
4. **Focus indicators** show which element has keyboard focus
5. **Toast notifications** announce important actions

## 📝 Usage Examples

### Quick Edit Workflow

1. Upload image → Canvas shows
2. Click image on canvas to select
3. <kbd>Delete</kbd> to remove or modify in Properties Panel
4. <kbd>Ctrl</kbd> + <kbd>S</kbd> to save

### Keyboard-Only Workflow

1. Tab to image upload area
2. <kbd>Enter</kbd> to activate and select file
3. Tab to canvas
4. <kbd>Tab</kbd> to select elements
5. <kbd>Delete</kbd> to remove selected
6. <kbd>Ctrl</kbd> + <kbd>S</kbd> to save

## 🔄 Implementation Status

✅ **Completed:**

- Keyboard shortcuts hook (`useKeyboardShortcuts`)
- ARIA labels on all interactive elements
- Focus indicators with ring styles
- Semantic HTML structure
- Screen reader announcements

⏳ **Future Enhancements:**

- Undo/Redo functionality with history stack
- Select All elements functionality
- Voice commands support
- High contrast mode toggle
- Text size adjustment

---

For more information, see [Accessibility Utilities](./accessibility.ts) and [Keyboard Shortcuts Hook](./useKeyboardShortcuts.ts).
