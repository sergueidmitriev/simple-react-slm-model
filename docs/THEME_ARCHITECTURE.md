# Theme Architecture Documentation

## Overview
This document describes the theme system architecture implemented in the Simple React SLM Model application. The system provides a clean separation of concerns between styling and component logic.

## Architecture Pattern: Theme Context + CSS Variables

### Key Principles
1. **Complete separation of styling from components** - All styling logic is in CSS files
2. **No prop drilling** - Theme state managed via React Context
3. **Semantic class names** - Components use descriptive CSS classes
4. **CSS Custom Properties** - Dynamic theming through CSS variables
5. **LocalStorage persistence** - Theme preference saved across sessions

## File Structure

```
frontend/src/
├── contexts/
│   └── ThemeContext.tsx        # Global theme state management
├── styles/
│   └── theme.css               # All theme-specific styles
├── types/
│   └── theme.ts                # Theme enum definition
└── components/
    ├── Chat.tsx                # No theme prop drilling
    ├── ChatContainer.tsx       # Uses .chat-container class
    ├── ChatHeader.tsx          # Uses .chat-header class
    ├── ThemeToggle.tsx         # Uses .theme-toggle class
    ├── ConnectionStatus.tsx    # Uses .status-indicator class
    ├── MessageList.tsx         # Uses .message-list class
    ├── MessageInput.tsx        # Uses .chat-input class
    └── Message.tsx             # Uses .message-bubble class
```

## Implementation Details

### 1. Theme Context (`ThemeContext.tsx`)

Provides global theme state without prop drilling:

```typescript
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

Features:
- React Context API for state management
- `useTheme()` custom hook for consuming context
- LocalStorage integration for persistence
- Automatic `data-theme` attribute on document root

### 2. CSS Variables (`theme.css`)

Two complete theme definitions:

**Modern Theme** (`[data-theme="modern"]`)
- Light blue/indigo color scheme
- Rounded corners (1rem border-radius)
- Gradient backgrounds
- Sans-serif fonts
- Soft shadows

**Terminal Theme** (`[data-theme="terminal"]`)
- Black background with green text
- Zero border-radius (square corners)
- Monospace fonts
- Green borders and glow effects
- Retro command-line aesthetic

### 3. Component Classes

Components use semantic CSS classes that automatically adapt to the current theme:

- `.chat-container` - Main app container with gradient/black background
- `.chat-box` - Chat window with rounded/square styling
- `.chat-header` - Header with gradient/bordered styling
- `.chat-input` - Input field with theme-aware styling
- `.chat-button` - Send button with theme colors
- `.message-bubble.user` - User message styling
- `.message-bubble.assistant` - Assistant message styling
- `.theme-toggle` - Toggle switch component
- `.status-indicator` - Connection status display
- `.empty-state` - Empty conversation state
- `.loading-indicator` - Loading animation
- `.error-message` - Error display

## Usage in Components

### Before (with prop drilling and inline conditionals):
```typescript
interface MessageProps {
  message: Message;
  theme: Theme;  // ❌ Prop drilling
}

const MessageComponent: React.FC<MessageProps> = ({ message, theme }) => {
  const isUser = message.role === 'user';
  
  // ❌ Inline conditional styling logic - using old utility functions
  const bubbleStyles = isUser
    ? (theme === Theme.Terminal 
        ? 'bg-green-950 border-2 border-green-500 text-green-400 font-mono'
        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl')
    : (theme === Theme.Terminal
        ? 'bg-black border-2 border-green-600 text-green-500 font-mono'
        : 'bg-white text-gray-800 border border-gray-200 rounded-2xl');

  return (
    <div className={`max-w-xs px-4 py-3 ${bubbleStyles}`}>
      {message.content}
    </div>
  );
};
```

### After (with CSS classes):
```typescript
interface MessageProps {
  message: Message;  // ✅ No theme prop needed
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // ✅ Simple semantic classes
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {message.content}
      </p>
      <p className="message-timestamp">
        {message.timestamp.toLocaleTimeString()}
      </p>
    </div>
  );
};
```

### Using the Theme Hook:
```typescript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Use theme value for logic (not styling)
  const title = theme === Theme.Terminal 
    ? '> TERMINAL_MODE' 
    : 'Modern Interface';
  
  return (
    <div className="my-component">  {/* CSS handles styling */}
      <h1>{title}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```

## Benefits

### 1. **Maintainability**
- All styling in one place (`theme.css`)
- Changes don't require touching component files
- Easy to add new themes

### 2. **Performance**
- CSS handles theme switching (no re-renders for styling)
- Browser optimizes CSS custom properties
- Smaller component bundle size

### 3. **Developer Experience**
- No prop drilling through component tree
- Clean, readable component code
- Clear separation of concerns
- TypeScript type safety maintained

### 4. **User Experience**
- Instant theme switching via CSS
- Theme preference persists across sessions
- Smooth transitions between themes

## Adding a New Theme

To add a new theme (e.g., "dark" mode):

1. **Add to Theme enum** (`types/theme.ts`):
```typescript
export enum Theme {
  Modern = 'modern',
  Terminal = 'terminal',
  Dark = 'dark',  // New theme
}
```

2. **Define CSS variables** (`styles/theme.css`):
```css
[data-theme="dark"] {
  --color-bg-primary: #1a1a1a;
  --color-text-primary: #e5e5e5;
  --color-accent: #8b5cf6;
  --border-radius: 0.5rem;
  /* ... etc */
}

/* Define component-specific overrides if needed */
[data-theme="dark"] .chat-box {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  box-shadow: 0 20px 50px rgba(139, 92, 246, 0.2);
}
```

3. **No component changes needed!** The existing components automatically use the new theme.

## Testing

To test themes:
1. Open http://localhost:3002
2. Click the "Switch style" toggle
3. Verify both themes render correctly
4. Refresh the page - theme should persist
5. Check browser DevTools: `data-theme` attribute on `<html>` element
6. Inspect CSS variables in browser DevTools

## Migration Notes

### Files Changed
- ✅ Removed theme props from all component interfaces
- ✅ Removed `/frontend/src/utils/themeStyles.ts` (deprecated - no longer needed)
- ✅ Created `/frontend/src/contexts/ThemeContext.tsx`
- ✅ Created `/frontend/src/styles/theme.css`
- ✅ Updated all 8 components to use CSS classes
- ✅ Wrapped `App` with `ThemeProvider` in `main.tsx`

### Breaking Changes
None - this is an internal refactoring. The UI and functionality remain identical.

## Future Enhancements

Possible improvements:
- Add more themes (high contrast, sepia, etc.)
- Add theme transition animations
- Support user-customizable colors
- Add dark mode auto-detection from system preferences
- Add per-component theme overrides
