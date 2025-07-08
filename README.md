# React History Stack Manager

[![npm version](https://badge.fury.io/js/react-history-stack-manager.svg)](https://badge.fury.io/js/react-history-stack-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React library for managing browser history stack with UI components (modal, sidebar, layer) integration. Provides native app-like navigation experience where the back button closes UI elements instead of navigating to the previous page.

## 🚀 Features

### Core Features
- **Native App-like UX**: Back button closes UI components instead of navigating away
- **Device-specific Behavior**: Different behavior for mobile and desktop
- **Multiple Component Support**: Works with modals, sidebars, layers, and custom components
- **React Hooks Integration**: Easy-to-use React hooks for seamless integration
- **TypeScript Support**: Full TypeScript support with detailed type definitions
- **SSR Compatible**: Works with Next.js and other SSR frameworks
- **Lightweight**: Minimal dependencies and small bundle size

### 🆕 Advanced Features
- **Accessibility Support**: Screen reader support, keyboard navigation, ARIA attributes
- **Internationalization (i18n)**: Multi-language support for 7 languages
- **Animation Callbacks**: Control opening/closing animations with callbacks
- **Gesture Support**: Swipe-to-close functionality for touch devices
- **Priority Stack**: Manage component priorities for complex UI hierarchies
- **Performance Optimized**: localStorage caching with debouncing
- **Race Condition Safe**: Atomic operations for concurrent access

### 🌐 Accessibility & i18n
- **WCAG 2.1 Compliant**: Full accessibility support
- **Screen Reader Support**: Live region announcements
- **Keyboard Navigation**: ESC key support, focus management
- **7 Languages Supported**: Korean, English, Japanese, Chinese, Spanish, French, German
- **Auto Language Detection**: Automatically detects browser language

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

### Advanced Usage with Animation Callbacks

```tsx
import React, { useState } from 'react';
import { useHistoryStack, AnimationCallbacks } from 'react-history-stack-manager';

function AnimatedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToStack, removeFromStack } = useHistoryStack();
  
  const animations: AnimationCallbacks = {
    onOpenStart: () => {
      console.log('Modal opening...');
      setIsAnimating(true);
    },
    onOpenComplete: () => {
      console.log('Modal opened!');
      setIsAnimating(false);
    },
    onCloseStart: () => {
      console.log('Modal closing...');
      setIsAnimating(true);
    },
    onCloseComplete: () => {
      console.log('Modal closed!');
      setIsAnimating(false);
      setIsOpen(false);
    }
  };
  
  const openModal = () => {
    setIsOpen(true);
    addToStack('modal', 'animated-modal', () => setIsOpen(false), animations, 10);
  };
  
  return (
    <>
      <button onClick={openModal}>Open Animated Modal</button>
      {isOpen && (
        <div className={`modal ${isAnimating ? 'animating' : ''}`}>
          <h2>Animated Modal</h2>
          <button onClick={() => removeFromStack('modal', 'animated-modal')}>
            Close
          </button>
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

### Internationalization Usage

```tsx
import React, { useEffect } from 'react';
import { setI18nConfig, detectBrowserLocale } from 'react-history-stack-manager';

function App() {
  useEffect(() => {
    // Auto-detect and set language
    const locale = detectBrowserLocale();
    setI18nConfig({ locale });
    
    // Or set custom language
    setI18nConfig({ 
      locale: 'ko',
      messages: {
        opened: '커스텀 메시지: {type}이(가) 열렸습니다.',
        closed: '커스텀 메시지: {type}이(가) 닫혔습니다.'
      }
    });
  }, []);
  
  return <YourApp />;
}
```

### Direct API Usage (without React)

```tsx
import historyStackManager from 'react-history-stack-manager';

// Initialize the history stack manager
const cleanup = historyStackManager.initHistoryStackManager();

// Add a component with animation callbacks and priority
historyStackManager.addToStack('modal', 'my-modal', 
  () => console.log('Modal closed by back button'),
  {
    onOpenStart: () => console.log('Opening...'),
    onCloseComplete: () => console.log('Closed!')
  },
  10 // priority
);

// Remove a component from the history stack
historyStackManager.removeFromStack('modal', 'my-modal');

// Cleanup when done
cleanup?.();
```

## 🔧 Configuration

### Default Options

The library comes with sensible defaults including accessibility and gesture support:

```typescript
const defaultOptions = {
  sidebar: { 
    mobile: true, 
    pc: false,
    accessibility: {
      escapeKeyClose: true,
      trapFocus: false,
      announceChanges: true,
      autoFocus: true
    },
    gestures: {
      swipeToClose: true,
      swipeDirection: 'left',
      swipeThreshold: 100,
      backdropClose: true
    },
    defaultPriority: 1
  },
  modal: { 
    mobile: true, 
    pc: true,
    accessibility: { /* full accessibility features */ },
    gestures: { /* full gesture support */ },
    defaultPriority: 10
  },
  layer: { 
    mobile: true, 
    pc: true,
    accessibility: { /* full accessibility features */ },
    gestures: { /* full gesture support */ },
    defaultPriority: 5
  }
};
```

### Customizing Options

```typescript
import { updateDefaultOptions } from 'react-history-stack-manager';

// Enable sidebar history management on PC
updateDefaultOptions('sidebar', { pc: true });

// Add custom component type with full configuration
updateDefaultOptions('drawer', { 
  mobile: true, 
  pc: false,
  accessibility: {
    escapeKeyClose: true,
    announceChanges: true
  },
  gestures: {
    swipeToClose: true,
    swipeDirection: 'right'
  },
  defaultPriority: 3
});
```

### Accessibility Configuration

```typescript
import type { AccessibilityOptions } from 'react-history-stack-manager';

const accessibilityConfig: AccessibilityOptions = {
  escapeKeyClose: true,      // ESC key closes components
  trapFocus: true,           // Trap focus within component
  announceChanges: true,     // Screen reader announcements
  autoFocus: true,           // Auto focus management
  ariaLabel: 'Custom modal', // Custom ARIA label
  ariaDescribedBy: 'modal-description' // ARIA description
};
```

### Gesture Configuration

```typescript
import type { GestureOptions } from 'react-history-stack-manager';

const gestureConfig: GestureOptions = {
  swipeToClose: true,           // Enable swipe to close
  swipeDirection: 'down',       // 'up', 'down', 'left', 'right', 'any'
  swipeThreshold: 150,          // Pixels to trigger close
  backdropClose: true           // Click backdrop to close
};
```

## 📚 API Reference

### Hooks

#### `useHistoryStack()`

Main hook for managing history stack with full feature support.

```typescript
const { addToStack, removeFromStack, stackItems, isEmpty } = useHistoryStack();
```

**Returns:**
- `addToStack(type, id?, onClose?, animations?, priority?)`: Add item to stack with advanced options
- `removeFromStack(type, id?)`: Remove item from stack
- `stackItems`: Current stack items (sorted by priority)
- `isEmpty`: Whether stack is empty

#### `useHistoryStackItem(type, id, onClose, isActive, accessibilityOptions?)`

Automatically manages a single item in the history stack with accessibility support.

**Parameters:**
- `type`: Component type (e.g., 'modal', 'sidebar')
- `id`: Optional unique identifier
- `onClose`: Callback function when item is closed
- `isActive`: Whether the item is currently active
- `accessibilityOptions`: Optional accessibility configuration

#### `useHistoryStackState()`

Lightweight hook for reading stack state only.

```typescript
const { stackItems, isEmpty } = useHistoryStackState();
```

### Core Functions

#### `addToStack(type, id?, onClose?, animations?, priority?)`

Add an item to the history stack with full feature support.

**Parameters:**
- `type`: Component type
- `id`: Optional unique identifier
- `onClose`: Callback function when closed
- `animations`: Optional animation callbacks
- `priority`: Optional priority level (higher = closes first)

#### `removeFromStack(type, id?)`

Remove an item from the history stack.

#### `initHistoryStackManager()`

Initialize the history stack manager. Returns cleanup function.
- Automatically detects and sets language
- Sets up event listeners
- Initializes accessibility features

#### `clearHisData()`

Clear all history data and reset state.

### Internationalization Functions

#### `setI18nConfig(config)`

Configure internationalization settings.

```typescript
setI18nConfig({
  locale: 'ko',  // or 'en', 'ja', 'zh-CN', 'es', 'fr', 'de'
  messages: {    // Optional custom messages
    opened: 'Custom open message for {type}',
    closed: 'Custom close message for {type}'
  }
});
```

#### `detectBrowserLocale()`

Automatically detect browser language.

#### `t(key, variables?)`

Translate message with variable substitution.

```typescript
const message = t('opened', { type: 'modal' });
```

## 🎨 Examples

### Accessible Modal Component

```tsx
import React, { useState } from 'react';
import { useHistoryStackItem, AccessibilityOptions } from 'react-history-stack-manager';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

function AccessibleModal({ isOpen, onClose, children, title }: ModalProps) {
  const accessibilityOptions: AccessibilityOptions = {
    escapeKeyClose: true,
    trapFocus: true,
    announceChanges: true,
    autoFocus: true,
    ariaLabel: title || 'Modal dialog',
    ariaDescribedBy: 'modal-content'
  };
  
  useHistoryStackItem('modal', undefined, onClose, isOpen, accessibilityOptions);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {title && <h2 id="modal-title">{title}</h2>}
        <div id="modal-content">{children}</div>
        <button onClick={onClose} aria-label="Close modal">×</button>
      </div>
    </div>
  );
}
```

### Swipeable Sidebar Component

```tsx
import React from 'react';
import { useHistoryStackItem, GestureOptions } from 'react-history-stack-manager';

interface SwipeableSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function SwipeableSidebar({ isOpen, onClose }: SwipeableSidebarProps) {
  // This will automatically handle swipe-left gestures to close
  useHistoryStackItem('sidebar', undefined, onClose, isOpen);
  
  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Navigation</h3>
          <button onClick={onClose} aria-label="Close sidebar">×</button>
        </div>
        <nav>
          <a href="/home">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </>
  );
}
```

### Priority-based Layer System

```tsx
import React, { useState } from 'react';
import { useHistoryStack, AnimationCallbacks } from 'react-history-stack-manager';

function LayerSystem() {
  const [layers, setLayers] = useState<string[]>([]);
  const { addToStack, removeFromStack, stackItems } = useHistoryStack();
  
  const addLayer = (type: string, priority: number) => {
    const id = `${type}-${Date.now()}`;
    const animations: AnimationCallbacks = {
      onOpenStart: () => console.log(`Opening ${type}`),
      onCloseComplete: () => {
        setLayers(prev => prev.filter(layerId => layerId !== id));
        console.log(`Closed ${type}`);
      }
    };
    
    setLayers(prev => [...prev, id]);
    addToStack(type, id, () => removeFromStack(type, id), animations, priority);
  };
  
  return (
    <div>
      <h2>Priority Layer System Demo</h2>
      <div className="controls">
        <button onClick={() => addLayer('tooltip', 1)}>
          Add Tooltip (Priority 1)
        </button>
        <button onClick={() => addLayer('modal', 10)}>
          Add Modal (Priority 10)
        </button>
        <button onClick={() => addLayer('notification', 15)}>
          Add Notification (Priority 15)
        </button>
      </div>
      
      <div className="stack-info">
        <h3>Current Stack (sorted by priority):</h3>
        <ul>
          {stackItems.map(item => (
            <li key={item.closeKey}>
              {item.type} (Priority: {item.priority})
            </li>
          ))}
        </ul>
      </div>
      
      {layers.map(layerId => {
        const type = layerId.split('-')[0];
        return (
          <div key={layerId} className={`layer layer-${type}`}>
            <h4>{type.toUpperCase()}</h4>
            <p>This is a {type} component</p>
            <button onClick={() => removeFromStack(type, layerId)}>
              Close {type}
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

### Multi-language Support Example

```tsx
import React, { useState, useEffect } from 'react';
import { 
  useHistoryStackItem, 
  setI18nConfig, 
  detectBrowserLocale,
  SupportedLocale 
} from 'react-history-stack-manager';

function MultiLanguageModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<SupportedLocale>('en');
  
  useEffect(() => {
    // Auto-detect browser language on mount
    const detectedLocale = detectBrowserLocale();
    setLocale(detectedLocale);
    setI18nConfig({ locale: detectedLocale });
  }, []);
  
  const changeLanguage = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setI18nConfig({ locale: newLocale });
  };
  
  useHistoryStackItem('modal', 'multi-lang-modal', () => setIsOpen(false), isOpen);
  
  const languageNames = {
    ko: '한국어',
    en: 'English', 
    ja: '日本語',
    'zh-CN': '中文',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch'
  };
  
  return (
    <>
      <div className="language-selector">
        <h3>Choose Language:</h3>
        {Object.entries(languageNames).map(([code, name]) => (
          <button 
            key={code}
            onClick={() => changeLanguage(code as SupportedLocale)}
            className={locale === code ? 'active' : ''}
          >
            {name}
          </button>
        ))}
      </div>
      
      <button onClick={() => setIsOpen(true)}>
        Open Modal (Current: {languageNames[locale]})
      </button>
      
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Multi-language Modal</h2>
            <p>
              This modal will announce in {languageNames[locale]} when opened/closed.
              Try using the ESC key or browser back button!
            </p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
```

### Next.js 13+ App Router Integration

```tsx
// app/layout.tsx
'use client';

import { useEffect } from 'react';
import { 
  initHistoryStackManager, 
  setI18nConfig, 
  detectBrowserLocale 
} from 'react-history-stack-manager';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize history stack manager with auto language detection
    const cleanup = initHistoryStackManager();
    
    // You can also set custom language here
    const userLocale = detectBrowserLocale();
    setI18nConfig({ 
      locale: userLocale,
      messages: {
        // Custom messages if needed
        opened: 'Your custom open message for {type}',
        closed: 'Your custom close message for {type}'
      }
    });
    
    return cleanup;
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Complete E-commerce Example

```tsx
import React, { useState } from 'react';
import { useHistoryStack, AnimationCallbacks } from 'react-history-stack-manager';

function EcommerceApp() {
  const [cartOpen, setCartOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { addToStack, removeFromStack } = useHistoryStack();
  
  const animations: AnimationCallbacks = {
    onOpenStart: () => document.body.classList.add('modal-opening'),
    onOpenComplete: () => document.body.classList.remove('modal-opening'),
    onCloseStart: () => document.body.classList.add('modal-closing'),
    onCloseComplete: () => document.body.classList.remove('modal-closing')
  };
  
  const openCart = () => {
    setCartOpen(true);
    // High priority - cart should close before other components
    addToStack('cart', 'shopping-cart', () => setCartOpen(false), animations, 20);
  };
  
  const openProductModal = () => {
    setProductModalOpen(true);
    // Medium priority
    addToStack('modal', 'product-modal', () => setProductModalOpen(false), animations, 10);
  };
  
  const openSidebar = () => {
    setSidebarOpen(true);
    // Low priority - closes first
    addToStack('sidebar', 'nav-sidebar', () => setSidebarOpen(false), animations, 1);
  };
  
  return (
    <div className="ecommerce-app">
      <header>
        <button onClick={openSidebar}>☰ Menu</button>
        <h1>E-commerce Store</h1>
        <button onClick={openCart}>🛒 Cart (3)</button>
      </header>
      
      <main>
        <div className="product-grid">
          <div className="product-card">
            <h3>Sample Product</h3>
            <button onClick={openProductModal}>View Details</button>
          </div>
        </div>
      </main>
      
      {/* Sidebar - lowest priority */}
      {sidebarOpen && (
        <div className="sidebar">
          <h3>Categories</h3>
          <ul>
            <li><a href="/electronics">Electronics</a></li>
            <li><a href="/clothing">Clothing</a></li>
            <li><a href="/books">Books</a></li>
          </ul>
        </div>
      )}
      
      {/* Product Modal - medium priority */}
      {productModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Product Details</h2>
            <p>Detailed product information...</p>
            <button onClick={() => removeFromStack('modal', 'product-modal')}>
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Cart - highest priority */}
      {cartOpen && (
        <div className="cart-overlay">
          <div className="cart-panel">
            <h2>Shopping Cart</h2>
            <div className="cart-items">
              <p>Cart items...</p>
            </div>
            <button onClick={() => removeFromStack('cart', 'shopping-cart')}>
              Close Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## 🎯 Use Cases

### Perfect For:
- **Mobile-first applications** where back button should close modals/sidebars
- **Progressive Web Apps (PWA)** needing native app-like navigation
- **Accessible applications** requiring WCAG 2.1 compliance
- **International applications** supporting multiple languages
- **Complex UIs** with layered components and priority management
- **Animation-heavy applications** needing coordinated open/close effects

### Real-world Examples:
- **E-commerce sites** with product modals, cart sidebars, and filter panels
- **Dashboard applications** with data modals, side panels, and notification overlays
- **Social media apps** with image viewers, story modals, and navigation drawers
- **Admin panels** with form modals, confirmation dialogs, and menu systems
- **Educational platforms** with lesson modals, navigation sidebars, and help tooltips
- **Healthcare apps** with patient modals, appointment sidebars, and accessibility features

## 🔧 Advanced Configuration

### Device Detection
The library automatically detects device type:
- **Mobile**: Screen width < 768px
- **Desktop**: Screen width >= 768px

### Performance Optimization
- **localStorage Caching**: Immediate memory cache with debounced persistence
- **Race Condition Prevention**: Atomic operations with lock mechanism
- **Event Debouncing**: Optimized event listener management
- **Memory Management**: Automatic cleanup of unused references

### Browser Compatibility
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **SSR Support**: Next.js, Nuxt.js, Gatsby, and other SSR frameworks
- **TypeScript**: Full TypeScript 4.0+ support

### Security & Accessibility
- **CSRF Protection**: No external network requests
- **Privacy Focused**: All data stored locally
- **WCAG 2.1 AA Compliant**: Full accessibility support
- **Keyboard Navigation**: Complete keyboard support
- **Screen Reader Compatible**: ARIA labels and live regions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by native mobile app navigation patterns
- Built with modern React patterns and TypeScript
- Designed for performance and developer experience 