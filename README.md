# React History Stack Manager

[![npm version](https://badge.fury.io/js/react-history-stack-manager.svg)](https://badge.fury.io/js/react-history-stack-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React library for managing browser history stack with UI components (modal, sidebar, layer) integration. Provides native app-like navigation experience where the back button closes UI elements instead of navigating to the previous page.

## 🚀 Features

- **Native App-like UX**: Back button closes UI components instead of navigating away
- **Device-specific Behavior**: Different behavior for mobile and desktop
- **Multiple Component Support**: Works with modals, sidebars, layers, and custom components
- **React Hooks Integration**: Easy-to-use React hooks for seamless integration
- **TypeScript Support**: Full TypeScript support with detailed type definitions
- **SSR Compatible**: Works with Next.js and other SSR frameworks
- **Lightweight**: Minimal dependencies and small bundle size

## 📦 Installation

```bash
npm install react-history-stack-manager
# or
yarn add react-history-stack-manager
# or
pnpm add react-history-stack-manager
```

## 🎯 Quick Start

### Basic Usage with Hooks

```tsx
import React, { useState } from 'react';
import { useHistoryStackItem } from 'react-history-stack-manager';

function MyModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Automatically manages history stack when modal opens/closes
  useHistoryStackItem('modal', 'my-modal', () => setIsOpen(false), isOpen);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}
```

### Manual History Stack Management

```tsx
import React, { useState, useEffect } from 'react';
import { useHistoryStack } from 'react-history-stack-manager';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToStack, removeFromStack } = useHistoryStack();
  
  useEffect(() => {
    if (isModalOpen) {
      addToStack('modal', 'my-modal', () => setIsModalOpen(false));
    } else {
      removeFromStack('modal', 'my-modal');
    }
  }, [isModalOpen, addToStack, removeFromStack]);
  
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      {isModalOpen && <div>Modal Content</div>}
    </>
  );
}
```

### Direct API Usage (without React)

```tsx
import historyStackManager from 'react-history-stack-manager';

// Initialize the history stack manager
const cleanup = historyStackManager.initHistoryStackManager();

// Add a component to the history stack
historyStackManager.addHisData('modal', 'my-modal', () => {
  console.log('Modal closed by back button');
});

// Remove a component from the history stack
historyStackManager.removeHisData('modal', 'my-modal');

// Cleanup when done
cleanup?.();
```

## 🔧 Configuration

### Default Options

The library comes with sensible defaults:

```typescript
const defaultOptions = {
  sidebar: { mobile: true, pc: false },    // Sidebar: mobile only
  modal: { mobile: true, pc: true },       // Modal: both mobile and PC
  layer: { mobile: true, pc: true },       // Layer: both mobile and PC
};
```

### Customizing Options

```typescript
import { updateDefaultOptions } from 'react-history-stack-manager';

// Enable sidebar history management on PC
updateDefaultOptions('sidebar', { pc: true });

// Add custom component type
updateDefaultOptions('drawer', { mobile: true, pc: false });
```

## 📚 API Reference

### Hooks

#### `useHistoryStack()`

Main hook for managing history stack.

```typescript
const { addToStack, removeFromStack, stackItems, isEmpty } = useHistoryStack();
```

**Returns:**
- `addToStack(type, id?, onClose?)`: Add item to stack
- `removeFromStack(type, id?)`: Remove item from stack
- `stackItems`: Current stack items
- `isEmpty`: Whether stack is empty

#### `useHistoryStackItem(type, id, onClose, isActive)`

Automatically manages a single item in the history stack.

**Parameters:**
- `type`: Component type (e.g., 'modal', 'sidebar')
- `id`: Optional unique identifier
- `onClose`: Callback function when item is closed
- `isActive`: Whether the item is currently active

#### `useHistoryStackState()`

Lightweight hook for reading stack state only.

```typescript
const { stackItems, isEmpty } = useHistoryStackState();
```

### Core Functions

#### `addHisData(type, id?, close?)`

Add an item to the history stack.

#### `removeHisData(type, id?)`

Remove an item from the history stack.

#### `initHistoryStackManager()`

Initialize the history stack manager. Returns cleanup function.

#### `clearHisData()`

Clear all history data.

## 🎨 Examples

### Modal Component

```tsx
import React, { useState } from 'react';
import { useHistoryStackItem } from 'react-history-stack-manager';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  useHistoryStackItem('modal', undefined, onClose, isOpen);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>×</button>
      </div>
    </div>
  );
}
```

### Sidebar Component

```tsx
import React from 'react';
import { useHistoryStackItem } from 'react-history-stack-manager';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  useHistoryStackItem('sidebar', undefined, onClose, isOpen);
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav>
        <a href="/home">Home</a>
        <a href="/about">About</a>
      </nav>
    </div>
  );
}
```

### Next.js App Layout

```tsx
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { initHistoryStackManager } from 'react-history-stack-manager';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const cleanup = initHistoryStackManager();
    return cleanup;
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## 🎯 Use Cases

- **Mobile-first applications** where back button should close modals/sidebars
- **Progressive Web Apps (PWA)** needing native app-like navigation
- **Dashboard applications** with multiple layers of UI components
- **E-commerce sites** with product modals and shopping cart sidebars
- **Admin panels** with complex navigation structures

## 🔧 Device Detection

The library automatically detects device type:
- **Mobile**: Screen width < 768px
- **Desktop**: Screen width >= 768px

You can customize this behavior by overriding the device detection logic or using custom options for different component types.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by native mobile app navigation patterns
- Built with modern React patterns and TypeScript
- Designed for performance and developer experience 