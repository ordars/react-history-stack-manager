import { useState, useEffect, useCallback, useRef } from 'react';
import { UseHistoryStackReturn, HistoryStackItem, AccessibilityOptions } from './types';
import {
  addToStack as addStackItem,
  removeFromStack as removeStackItem,
  loadHisData,
  initHistoryStackManager,
} from './historyStackManager';

/**
 * 히스토리 스택을 관리하는 React 훅
 * 
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   const { addToStack, removeFromStack } = useHistoryStack();
 *   
 *   useEffect(() => {
 *     if (isOpen) {
 *       addToStack('modal', 'my-modal', onClose);
 *     } else {
 *       removeFromStack('modal', 'my-modal');
 *     }
 *   }, [isOpen, onClose, addToStack, removeFromStack]);
 *   
 *   return isOpen ? <div>Modal Content</div> : null;
 * }
 * ```
 */
export function useHistoryStack(): UseHistoryStackReturn {
  const [stackItems, setStackItems] = useState<HistoryStackItem[]>([]);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  // 스택 상태 업데이트
  const updateStackItems = useCallback(() => {
    setStackItems(loadHisData());
  }, []);

  // 히스토리 스택에 아이템 추가
  const addToStack = useCallback((type: string, id?: string, onClose?: () => void) => {
    addStackItem(type, id, onClose);
    updateStackItems();
  }, [updateStackItems]);

  // 히스토리 스택에서 아이템 제거
  const removeFromStack = useCallback((type: string, id?: string) => {
    removeStackItem(type, id).then(() => {
      updateStackItems();
    }).catch(error => {
      console.warn('Error removing from stack:', error);
      updateStackItems(); // 에러가 있어도 상태 업데이트
    });
  }, [updateStackItems]);

  // 초기화 및 정리
  useEffect(() => {
    // 히스토리 스택 매니저 초기화
    cleanupRef.current = initHistoryStackManager();
    
    // 초기 스택 상태 로드
    updateStackItems();

    // popstate 이벤트 시 스택 상태 업데이트
    const handleStackChange = () => {
      updateStackItems();
    };

    // 커스텀 이벤트로 스택 변경 알림 (선택적)
    window.addEventListener('historyStackChanged', handleStackChange);

    return () => {
      // 정리 함수 호출
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      window.removeEventListener('historyStackChanged', handleStackChange);
    };
  }, [updateStackItems]);

  return {
    addToStack,
    removeFromStack,
    stackItems,
    isEmpty: stackItems.length === 0,
  };
}

/**
 * 컴포넌트의 mount/unmount에 따라 자동으로 히스토리 스택을 관리하는 훅
 * 
 * @param type 컴포넌트 타입
 * @param id 선택적 고유 식별자
 * @param onClose 닫기 콜백 함수
 * @param isActive 활성 상태 (true일 때만 스택에 추가)
 * 
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   useHistoryStackItem('modal', 'my-modal', onClose, isOpen);
 *   
 *   return isOpen ? <div>Modal Content</div> : null;
 * }
 * ```
 */
export function useHistoryStackItem(
  type: string,
  id: string | undefined,
  onClose: (() => void) | undefined,
  isActive: boolean = true,
  accessibilityOptions?: AccessibilityOptions
): void {
  const { addToStack, removeFromStack } = useHistoryStack();

  useEffect(() => {
    if (isActive && onClose) {
      // TODO: 향후 버전에서 accessibilityOptions를 지원할 예정
      // if (accessibilityOptions) { ... }
      
      addToStack(type, id, onClose);
      
      return () => {
        removeFromStack(type, id);
      };
    }
  }, [type, id, onClose, isActive, addToStack, removeFromStack]);
}

/**
 * 현재 히스토리 스택의 상태만 구독하는 가벼운 훅
 * 
 * @example
 * ```tsx
 * function StackIndicator() {
 *   const { stackItems, isEmpty } = useHistoryStackState();
 *   
 *   return (
 *     <div>
 *       스택 아이템 수: {stackItems.length}
 *       {isEmpty && <span>스택이 비어있습니다</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHistoryStackState(): Pick<UseHistoryStackReturn, 'stackItems' | 'isEmpty'> {
  const [stackItems, setStackItems] = useState<HistoryStackItem[]>([]);

  const updateStackItems = useCallback(() => {
    setStackItems(loadHisData());
  }, []);

  useEffect(() => {
    // 초기 상태 로드
    updateStackItems();

    // 스택 변경 감지
    const handleStackChange = () => {
      updateStackItems();
    };

    window.addEventListener('historyStackChanged', handleStackChange);
    window.addEventListener('popstate', handleStackChange);

    return () => {
      window.removeEventListener('historyStackChanged', handleStackChange);
      window.removeEventListener('popstate', handleStackChange);
    };
  }, [updateStackItems]);

  return {
    stackItems,
    isEmpty: stackItems.length === 0,
  };
}
