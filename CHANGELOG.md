# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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