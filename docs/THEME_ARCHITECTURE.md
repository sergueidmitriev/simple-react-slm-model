# Theme Architecture

Theme system design and implementation overview.

---

## Design Pattern

**Context + CSS Variables**

- Theme state managed via React Context
- All styling in CSS files (no inline styles)
- CSS custom properties for dynamic theming
- LocalStorage persistence

---

## Key Principles

1. **Separation of concerns** - Styling separate from components
2. **No prop drilling** - Context provides theme globally
3. **Semantic classes** - Descriptive CSS class names
4. **CSS custom properties** - Dynamic theme switching
5. **Persistence** - Theme saved across sessions

---

## Implementation

### Theme Context

Provides global theme state without prop drilling:

```typescript
interface ThemeContextValue {
  theme: Theme;          // Current theme
  setTheme: (theme) => void;
  toggleTheme: () => void;
}
```

**Features:**
- React Context for state management
- `useTheme()` hook for components
- LocalStorage integration
- Automatic `data-theme` attribute on root element

### CSS Variables

Two theme definitions in CSS:

**Modern Theme** (`[data-theme="modern"]`)
- Light colors with gradients
- Rounded corners
- Soft shadows
- Sans-serif fonts

**Terminal Theme** (`[data-theme="terminal"]`)
- Black background, green text
- Square corners
- Monospace fonts
- Retro command-line aesthetic

### Component Styling

Components use semantic CSS classes that adapt automatically:

- `.chat-container` - Main container
- `.chat-box` - Chat window
- `.chat-header` - Header section
- `.chat-input` - Input field
- `.chat-button` - Action buttons
- `.message-bubble` - Message display
- `.status-indicator` - Connection status
- `.loading-indicator` - Loading animation

---

## Usage Example

**Before (prop drilling + inline styles):**
```typescript
const Message = ({ message, theme }) => {
  const styles = theme === Theme.Terminal 
    ? 'bg-black border-green text-green font-mono'
    : 'bg-white rounded shadow';
  
  return <div className={styles}>{message.content}</div>;
};
```

**After (CSS classes only):**
```typescript
const Message = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      {message.content}
    </div>
  );
};
```

**Using theme for logic (not styling):**
```typescript
const Header = () => {
  const { theme } = useTheme();
  
  // Theme affects content, not styling
  const title = theme === Theme.Terminal 
    ? '> TERMINAL_MODE' 
    : 'Modern Interface';
  
  return <h1 className="chat-header">{title}</h1>;
};
```

---

## Benefits

### Maintainability
- All styling in one place
- Changes don't require component edits
- Easy to add new themes

### Performance
- CSS handles theme switching (no re-renders)
- Browser optimizes CSS variables
- Smaller component bundle size

### Developer Experience
- No prop drilling
- Clean component code
- Clear separation of concerns
- TypeScript type safety

### User Experience
- Instant theme switching
- Theme persists across sessions
- Smooth transitions

---

## Adding New Themes

To add a new theme (e.g., "dark"):

1. **Add to enum:**
```typescript
export enum Theme {
  Modern = 'modern',
  Terminal = 'terminal',
  Dark = 'dark',  // New
}
```

2. **Define CSS:**
```css
[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-text-primary: #e5e5e5;
  --color-accent: #8b5cf6;
  /* ... other variables */
}

[data-theme="dark"] .chat-box {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}
```

3. **No component changes needed!**

---

## Testing

```bash
# Start application
make dev

# Open browser
open http://localhost:3002

# Test:
# 1. Toggle theme button
# 2. Verify both themes render correctly
# 3. Refresh page - theme should persist
# 4. Check DevTools: data-theme attribute on <html>
```

---

## Future Enhancements

- Additional themes (high contrast, sepia, etc.)
- Theme transition animations
- User-customizable colors
- System preference auto-detection
- Per-component theme overrides

---

## Resources

- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [React Context API](https://react.dev/reference/react/useContext)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
