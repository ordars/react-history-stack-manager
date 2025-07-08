import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { useHistoryStack, useHistoryStackItem } from '../src/useHistoryStack';

describe('useHistoryStack', () => {
  beforeEach(() => {
    // 모바일 환경 설정
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
  });

  it('초기 상태가 올바르게 설정되어야 한다', () => {
    const { result } = renderHook(() => useHistoryStack());

    expect(result.current.stackItems).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
    expect(typeof result.current.addToStack).toBe('function');
    expect(typeof result.current.removeFromStack).toBe('function');
  });

  it('스택에 아이템을 추가할 수 있어야 한다', () => {
    const { result } = renderHook(() => useHistoryStack());

    act(() => {
      result.current.addToStack('modal', 'test-modal');
    });

    expect(result.current.stackItems).toHaveLength(1);
    expect(result.current.stackItems[0].type).toBe('modal');
    expect(result.current.stackItems[0].id).toBe('test-modal');
    expect(result.current.isEmpty).toBe(false);
  });

  it('스택에서 아이템을 제거할 수 있어야 한다', () => {
    const { result } = renderHook(() => useHistoryStack());

    act(() => {
      result.current.addToStack('modal', 'test-modal');
    });

    expect(result.current.stackItems).toHaveLength(1);

    act(() => {
      result.current.removeFromStack('modal', 'test-modal');
    });

    expect(result.current.stackItems).toHaveLength(0);
    expect(result.current.isEmpty).toBe(true);
  });
});

describe('useHistoryStackItem', () => {
  function TestComponent({ isActive, onClose }: { isActive: boolean; onClose: () => void }) {
    useHistoryStackItem('modal', 'test-modal', onClose, isActive);
    return <div>Test Component</div>;
  }

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
  });

  it('컴포넌트가 활성화되면 스택에 추가되어야 한다', () => {
    const mockOnClose = jest.fn();
    
    render(<TestComponent isActive={true} onClose={mockOnClose} />);

    // 스택 상태를 확인하기 위해 useHistoryStack 훅을 별도로 테스트
    const { result } = renderHook(() => useHistoryStack());
    
    expect(result.current.stackItems.length).toBeGreaterThan(0);
  });

  it('컴포넌트가 비활성화되면 스택에서 제거되어야 한다', () => {
    const mockOnClose = jest.fn();
    
    const { rerender } = render(<TestComponent isActive={true} onClose={mockOnClose} />);
    
    // 비활성화
    rerender(<TestComponent isActive={false} onClose={mockOnClose} />);

    const { result } = renderHook(() => useHistoryStack());
    // 스택이 비어있거나 해당 아이템이 없어야 함
    const hasTestModal = result.current.stackItems.some(item => item.id === 'test-modal');
    expect(hasTestModal).toBe(false);
  });
}); 