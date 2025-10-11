# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
정치방망이 (Polibat) - A political community platform for communication between politicians and citizens. Frontend-only web application built with HTML, Bootstrap, jQuery, and vanilla JavaScript.

## Bash Commands
```bash
# Development
python -m http.server 8000    # Start local dev server (Python 3)
python -m SimpleHTTPServer     # Start local dev server (Python 2)

# File operations
find . -name "*.html" -type f  # Find all HTML files
grep -r "function" js/         # Search for functions in JS files

# Testing login
# Open http://localhost:8000/login.html
# Test accounts: test@example.com / test123
```

## Code Style Guidelines

### JavaScript
- **IMPORTANT**: Use ES5 syntax (no arrow functions, const/let)
- jQuery for DOM manipulation in main.js
- Vanilla JS for core functionality (page-manager.js, login.js)
- Always check jQuery availability before using
- Use console.log with emojis for debugging (e.g., '✅', '❌', '🔍')

### HTML
- Include header/footer via div includes
- Load jQuery before any dependent scripts
- **YOU MUST** load page-manager.js last in body

### CSS
- Bootstrap 3.x for base styles
- Custom styles in css/style.css only
- Use CSS variables in :root for consistency

## Workflow Instructions

### Adding New Pages
1. **IMPORTANT**: Create HTML with header/footer includes
2. Add page mapping in page-manager.js if needed
3. Test page detection in console
4. Verify header/footer load correctly

### Modifying Authentication
- **YOU MUST** update VALID_ACCOUNTS in login.js
- Test with multiple account types
- Check localStorage for session persistence
- Verify redirect logic works

### Testing Changes
- **Prefer** testing in browser console first
- Check for jQuery errors
- Verify page-manager.js loads correctly
- Test on both logged-in and logged-out states

## Repository Structure
```
/
├── CLAUDE.md           # English instructions (this file)
├── CLAUDE_KO.md        # Korean instructions (keep synchronized)
├── *.html              # Page files
├── page-manager.js     # Page state management
├── login.js            # Authentication system
├── css/
│   ├── bootstrap.css   # Bootstrap framework
│   └── style.css       # Custom styles
├── js/
│   ├── main.js         # jQuery plugins
│   └── *.min.js        # Vendor libraries
└── sass/               # SCSS sources (not compiled)
```

## Developer Environment

### Required Tools
- Any modern browser with DevTools
- Text editor with HTML/JS/CSS support
- Local HTTP server (Python's built-in recommended)

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Test media queries
- IE11: Limited support (polyfills loaded)

## Repository Etiquette

### File Modifications
- **NEVER** modify vendor files (*.min.js, bootstrap.css)
- **ALWAYS** test changes locally before saving
- Keep console.log statements for development only
- Document complex logic with Korean comments

### Code Organization
- One feature per function
- Group related functions in sections
- Use descriptive variable names in Korean context
- Maintain consistent indentation (tabs)

## Language Preference
- **Work History Display**: All work history, commit messages, and code comments in Korean
- **User Communication**: Respond and explain in Korean
- **Documentation**: Korean first, with English when necessary
- **Variable Names**: English for code, Korean for comments

## Common Issues & Solutions

### Header/Footer Not Loading
```javascript
// Check in console
PageManager.checkInitialization();
// Verify file paths are correct
```

### Login Not Working
```javascript
// Verify test accounts in login.js
console.log(VALID_ACCOUNTS);
// Clear localStorage
localStorage.clear();
```

### Page Detection Failed
```javascript
// Check current page detection
PageDetector.detectCurrentPage();
// Add page to mapping if needed
```

## File Synchronization Guide
**CRITICAL**: CLAUDE.md and CLAUDE_KO.md must always be synchronized
- When modifying one file, **YOU MUST** update the other
- CLAUDE.md = English version
- CLAUDE_KO.md = Korean version
- Structure and content must be identical
- Only language differs between files
- Last updated: 2025-09-23

## Quick Reference
- Test User: test@example.com / test123
- Test Politician: politician@example.com / pol123
- Session Storage: localStorage (userLoggedIn, userType, userEmail, userNickname)
- Page Detection: Automatic via page-manager.js
- Header/Footer: Loaded dynamically from header.html and footer.html