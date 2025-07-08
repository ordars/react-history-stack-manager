import '@testing-library/jest-dom';

// localStorage mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// window.history mock
const historyMock = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  go: jest.fn(),
};
Object.defineProperty(window, 'history', {
  value: historyMock,
  writable: true,
});

// window.innerWidth mock
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// CustomEvent mock for older environments
global.CustomEvent = class CustomEvent extends Event {
  detail: any;
  constructor(type: string, options: any = {}) {
    super(type, options);
    this.detail = options.detail;
  }
} as any;

beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
}); 