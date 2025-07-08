import {
  addHisData,
  removeHisData,
  clearHisData,
  getStackItems,
  isStackEmpty,
  initHistoryStackManager,
  updateDefaultOptions,
  defaultOptions,
} from '../src/historyStackManager';

describe('historyStackManager', () => {
  beforeEach(() => {
    // 각 테스트 전에 스택 초기화
    clearHisData();
    jest.clearAllMocks();
  });

  describe('addHisData', () => {
    it('모바일에서 모달을 히스토리 스택에 추가해야 한다', () => {
      // 모바일 환경 시뮬레이션
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      
      const mockClose = jest.fn();
      addHisData('modal', 'test-modal', mockClose);
      
      const stackItems = getStackItems();
      expect(stackItems).toHaveLength(1);
      expect(stackItems[0].type).toBe('modal');
      expect(stackItems[0].id).toBe('test-modal');
      expect(window.history.pushState).toHaveBeenCalled();
    });

    it('PC에서 사이드바는 히스토리 스택에 추가되지 않아야 한다', () => {
      // PC 환경 시뮬레이션
      Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
      
      const mockClose = jest.fn();
      addHisData('sidebar', 'test-sidebar', mockClose);
      
      const stackItems = getStackItems();
      expect(stackItems).toHaveLength(0);
      expect(window.history.pushState).not.toHaveBeenCalled();
    });

    it('알 수 없는 타입에 대해 경고를 출력해야 한다', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      addHisData('unknown-type', 'test-id');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unknown type "unknown-type" in defaultOptions. Skipping history stack management.'
      );
      expect(getStackItems()).toHaveLength(0);
      
      consoleSpy.mockRestore();
    });
  });

  describe('removeHisData', () => {
    it('특정 타입과 ID의 아이템을 제거해야 한다', () => {
      // 모바일 환경에서 아이템 추가
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      
      addHisData('modal', 'test-modal-1');
      addHisData('modal', 'test-modal-2');
      
      expect(getStackItems()).toHaveLength(2);
      
      removeHisData('modal', 'test-modal-1');
      
      const stackItems = getStackItems();
      expect(stackItems).toHaveLength(1);
      expect(stackItems[0].id).toBe('test-modal-2');
    });

    it('ID 없이 타입만으로 첫 번째 일치하는 아이템을 제거해야 한다', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      
      addHisData('modal', 'test-modal-1');
      addHisData('modal', 'test-modal-2');
      
      removeHisData('modal');
      
      expect(getStackItems()).toHaveLength(1);
    });
  });

  describe('clearHisData', () => {
    it('모든 히스토리 데이터를 초기화해야 한다', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      
      addHisData('modal', 'test-modal');
      expect(getStackItems()).toHaveLength(1);
      
      clearHisData();
      
      expect(getStackItems()).toHaveLength(0);
      expect(isStackEmpty()).toBe(true);
    });
  });

  describe('updateDefaultOptions', () => {
    it('기존 타입의 옵션을 업데이트해야 한다', () => {
      updateDefaultOptions('sidebar', { pc: true });
      
      expect(defaultOptions.sidebar.pc).toBe(true);
      expect(defaultOptions.sidebar.mobile).toBe(true); // 기존 값 유지
    });

    it('새로운 타입의 옵션을 생성해야 한다', () => {
      updateDefaultOptions('drawer', { mobile: true, pc: false });
      
      expect(defaultOptions.drawer).toEqual({
        mobile: true,
        pc: false,
      });
    });
  });

  describe('initHistoryStackManager', () => {
    it('초기화 함수가 정리 함수를 반환해야 한다', () => {
      const cleanup = initHistoryStackManager();
      
      expect(typeof cleanup).toBe('function');
      expect(window.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
      expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('정리 함수가 이벤트 리스너를 제거해야 한다', () => {
      const cleanup = initHistoryStackManager();
      
      if (cleanup) {
        cleanup();
      }
      
      expect(window.removeEventListener).toHaveBeenCalledWith('popstate', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('중복 초기화를 방지해야 한다', () => {
      const cleanup1 = initHistoryStackManager();
      const cleanup2 = initHistoryStackManager();
      
      // 두 번째 호출에서도 정리 함수를 반환해야 함
      expect(typeof cleanup1).toBe('function');
      expect(typeof cleanup2).toBe('function');
      
      // 정리 함수들을 호출
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
    });
  });

  describe('커스텀 이벤트', () => {
    it('스택 변경 시 historyStackChanged 이벤트를 발생시켜야 한다', () => {
      const eventSpy = jest.spyOn(window, 'dispatchEvent');
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      
      addHisData('modal', 'test-modal');
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'historyStackChanged'
        })
      );
      
      eventSpy.mockRestore();
    });
  });
}); 