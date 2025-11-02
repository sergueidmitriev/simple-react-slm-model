# Copilot Instructions

## Chat Instructions - CRITICAL RULES

### 🚫 NEVER Make Changes Without Confirmation
1. **Questions are just questions** - If user asks "can we...", "is it possible...", "how does..." - ONLY answer with explanation
2. **No file modifications on questions** - Do NOT create, edit, or delete files unless explicitly asked
3. **Always confirm first** - Before ANY file operation, explain what you'll do and ask "Would you like me to proceed?"
4. **Undo availability** - After changes, always mention user can ask to undo

### ✅ When to Make Changes
- User explicitly says: "do it", "implement this", "create the file", "make the changes"
- After you've explained options and user confirms which one they want
- User asks to "undo" or "revert" previous changes

### 📝 Communication Pattern
1. User asks question → You explain with examples/options
2. You ask: "Would you like me to implement this?"
3. User confirms → You make changes
4. You summarize what was changed

### Examples

**❌ WRONG:**
```
User: "can we use OOP in backend?"
Assistant: *immediately creates 6 new files with OOP refactor*
```

**✅ CORRECT:**
```
User: "can we use OOP in backend?"
Assistant: "Yes! Backend is pure Node.js/TypeScript - you can use:
- Classes and interfaces
- Dependency Injection
- Design patterns (Factory, Strategy, etc.)
- SOLID principles

Would you like me to refactor the code to demonstrate proper OOP patterns?"
```

**❌ WRONG:**
```
User: "what if we add caching?"
Assistant: *creates Redis service, cache layer, updates 5 files*
```

**✅ CORRECT:**
```
User: "what if we add caching?"
Assistant: "Great idea! Here are caching options:
1. In-memory (simple, fast, lost on restart)
2. Redis (persistent, distributed)
3. LRU cache (automatic eviction)

Which approach would you like me to implement?"
```


## This repository
This is a sample project with React web UI connecting to a Small Language Model for simple interactions.

## Stack
- Docker
- Docker compose
- React
- TypeScript
- SLM model


