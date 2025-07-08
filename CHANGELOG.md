# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-01-11

### 🚀 Major Features Added

#### Accessibility Support (WCAG 2.1 Compliant)
- **Screen Reader Support**: Live region announcements for stack changes
- **Keyboard Navigation**: ESC key support with configurable behavior
- **Focus Management**: Automatic focus save/restore for modal components
- **ARIA Attributes**: Comprehensive ARIA label and description support
- **Focus Trapping**: Optional focus trapping within components

#### Internationalization (i18n)
- **7 Languages Supported**: Korean, English, Japanese, Chinese (Simplified), Spanish, French, German
- **Auto Language Detection**: Automatically detects browser language
- **Custom Messages**: Override default messages with custom translations
- **Variable Substitution**: Dynamic message variables (e.g., `{type}` for component type)
- **Localized Error Messages**: All error messages and announcements are translated

#### Advanced Features
- **Animation Callbacks**: `onOpenStart`, `onOpenComplete`, `onCloseStart`, `onCloseComplete`
- **Priority Stack System**: Components with higher priority close first
- **Gesture Support**: Swipe-to-close functionality for touch devices
- **Creation Timestamps**: Track when each stack item was created

#### Developer Tools & Debugging
- **Performance Monitoring**: Real-time metrics for operations, cache, and locks
- **Debug Information**: Comprehensive debug data with stack state and performance
- **Event Logging**: Categorized logging system with different log levels
- **Memory Analysis**: Memory usage tracking and recommendations
- **DevTools Integration**: Connect to React/Redux DevTools extensions
- **Global Debug Functions**: `window.historyStackDebug` for browser console debugging

### 📈 Performance Improvements
- **localStorage Caching**: Memory-first approach with debounced persistence (100ms)
- **Race Condition Prevention**: Atomic operations with lock mechanism
- **Cache Hit Tracking**: Monitor cache performance with metrics
- **Memory Optimization**: Automatic cleanup and memory leak prevention
- **Event Debouncing**: Optimized event listener management

### 🔧 API Enhancements

#### New Function Signatures
```typescript
// Enhanced addToStack with animation callbacks and priority
addToStack(type, id?, onClose?, animations?, priority?)

// Accessibility options for hooks
useHistoryStackItem(type, id, onClose, isActive, accessibilityOptions?)
```

#### New Configuration Options
```typescript
interface DeviceOptions {
  accessibility?: AccessibilityOptions;
  gestures?: GestureOptions;
  defaultPriority?: number;
}

interface AccessibilityOptions {
  escapeKeyClose?: boolean;
  trapFocus?: boolean;
  announceChanges?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

interface GestureOptions {
  swipeToClose?: boolean;
  swipeDirection?: 'up' | 'down' | 'left' | 'right' | 'any';
  swipeThreshold?: number;
  backdropClose?: boolean;
}
```

#### New Exports
```typescript
// Internationalization
export { setI18nConfig, getI18nConfig, detectBrowserLocale, autoDetectAndSetLocale, t }

// Developer Tools
export { enableDevMode, getDebugInfo, generatePerformanceReport, validateStackState }

// Types
export type { AccessibilityOptions, AnimationCallbacks, GestureOptions, DebugInfo }
```

### 🌐 Enhanced Default Configuration
- **Sidebar**: Swipe-left to close, priority 1, limited focus trap
- **Modal**: Full accessibility features, priority 10, swipe any direction
- **Layer**: Balanced configuration, priority 5, gesture support

### 📚 Documentation Improvements
- **Comprehensive Examples**: Real-world examples for e-commerce, dashboards, etc.
- **Accessibility Guide**: WCAG 2.1 compliance examples
- **Performance Guide**: Optimization tips and monitoring
- **Multi-language Examples**: i18n implementation patterns
- **Developer Tools Guide**: Debugging and performance monitoring

### 🔄 API Enhancements (Backward Compatible)
- `addToStack` function signature extended with optional parameters
- Default options enhanced with accessibility and gesture configurations
- Performance monitoring available when explicitly enabled

### 🐛 Bug Fixes
- **Critical**: Self-referencing dependency removed from package.json
- **Critical**: Custom event implementation for historyStackChanged
- **Critical**: Memory leak prevention with singleton pattern
- **Enhancement**: Test environment setup with Jest

### 🛠️ Development Improvements
- **Rollup Build System**: ESM, CJS, UMD multi-format support
- **ESLint + Prettier**: Code quality and consistency management
- **Enhanced TypeScript**: Better type definitions and developer experience
- **Comprehensive Testing**: Unit tests for all new features

## [1.0.0] - 2025-07-08

### Added
- Initial release of React History Stack Manager
- Core history stack management functionality
- React hooks for easy integration (`useHistoryStack`, `useHistoryStackItem`, `useHistoryStackState`)
- TypeScript support with full type definitions
- Device-specific behavior (mobile/desktop)
- Support for modals, sidebars, layers, and custom components
- SSR compatibility
- Comprehensive documentation and examples
- MIT license

### Features
- **Native App-like UX**: Back button closes UI components instead of navigating away
- **Device-specific Behavior**: Different behavior for mobile and desktop
- **Multiple Component Support**: Works with modals, sidebars, layers, and custom components
- **React Hooks Integration**: Easy-to-use React hooks for seamless integration
- **TypeScript Support**: Full TypeScript support with detailed type definitions
- **SSR Compatible**: Works with Next.js and other SSR frameworks
- **Lightweight**: Minimal dependencies and small bundle size

### API
- `historyStackManager` - Core manager object
- `addHisData(type, id?, close?)` - Add item to history stack
- `removeHisData(type, id?)` - Remove item from history stack
- `initHistoryStackManager()` - Initialize manager with cleanup
- `useHistoryStack()` - Main React hook
- `useHistoryStackItem()` - Auto-managed React hook
- `useHistoryStackState()` - State-only React hook

### Configuration
- Default options for sidebar, modal, and layer components
- Customizable device-specific behavior
- Support for custom component types 