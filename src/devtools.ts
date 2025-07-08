import { DebugInfo, LogEntry, PerformanceMonitoringOptions } from './types';
import { getI18nConfig } from './i18n';
import { defaultOptions, loadHisData } from './historyStackManager';

/**
 * 개발자 도구 전역 상태
 */
let isDevMode = false;
let performanceOptions: PerformanceMonitoringOptions = {
  enabled: false,
  logLevel: 'info',
  maxLogEntries: 1000,
  collectMetrics: true,
};

/**
 * 성능 메트릭
 */
let performanceMetrics = {
  totalOperations: 0,
  lockAcquisitions: 0,
  lockTimes: [] as number[],
  cacheHits: 0,
  cacheMisses: 0,
};

/**
 * 이벤트 로그
 */
let eventLog: LogEntry[] = [];

/**
 * 개발자 모드 활성화/비활성화
 */
export function enableDevMode(enabled: boolean = true): void {
  isDevMode = enabled;
  
  if (enabled) {
    logEvent('info', 'stack', 'Developer mode enabled');
    // DevTools 확장이 있으면 연결
    connectToDevToolsExtension();
  } else {
    logEvent('info', 'stack', 'Developer mode disabled');
  }
}

/**
 * 성능 모니터링 설정
 */
export function configurePerformanceMonitoring(options: Partial<PerformanceMonitoringOptions>): void {
  performanceOptions = { ...performanceOptions, ...options };
  logEvent('info', 'performance', 'Performance monitoring configured', options);
}

/**
 * 이벤트 로깅
 */
export function logEvent(
  level: LogEntry['level'],
  category: LogEntry['category'],
  message: string,
  data?: any
): void {
  if (!performanceOptions.enabled && !isDevMode) return;
  
  const logLevels = { debug: 0, info: 1, warn: 2, error: 3 };
  const currentLogLevel = logLevels[performanceOptions.logLevel];
  const messageLogLevel = logLevels[level];
  
  if (messageLogLevel < currentLogLevel) return;
  
  const entry: LogEntry = {
    timestamp: Date.now(),
    level,
    category,
    message,
    data,
  };
  
  eventLog.push(entry);
  
  // 최대 로그 엔트리 수 제한
  if (eventLog.length > performanceOptions.maxLogEntries) {
    eventLog.shift();
  }
  
  // 개발자 모드에서 콘솔에 출력
  if (isDevMode) {
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : 
                     level === 'debug' ? console.debug : console.log;
    
    logMethod(`[HistoryStack:${category}] ${message}`, data || '');
  }
  
  // DevTools 확장에 전송
  sendToDevToolsExtension(entry);
}

/**
 * 성능 메트릭 업데이트
 */
export function updatePerformanceMetrics(type: keyof typeof performanceMetrics, value?: number): void {
  if (!performanceOptions.collectMetrics) return;
  
  switch (type) {
    case 'totalOperations':
      performanceMetrics.totalOperations++;
      break;
    case 'lockAcquisitions':
      performanceMetrics.lockAcquisitions++;
      break;
    case 'lockTimes':
      if (value !== undefined) {
        performanceMetrics.lockTimes.push(value);
        // 최근 100개만 유지
        if (performanceMetrics.lockTimes.length > 100) {
          performanceMetrics.lockTimes.shift();
        }
      }
      break;
    case 'cacheHits':
      performanceMetrics.cacheHits++;
      break;
    case 'cacheMisses':
      performanceMetrics.cacheMisses++;
      break;
  }
  
  logEvent('debug', 'performance', `Performance metric updated: ${type}`, { value, metrics: performanceMetrics });
}

/**
 * 디버그 정보 가져오기
 */
export function getDebugInfo(): DebugInfo {
  const averageLockTime = performanceMetrics.lockTimes.length > 0
    ? performanceMetrics.lockTimes.reduce((a, b) => a + b, 0) / performanceMetrics.lockTimes.length
    : 0;
  
  return {
    stackItems: loadHisData(),
    performance: {
      totalOperations: performanceMetrics.totalOperations,
      lockAcquisitions: performanceMetrics.lockAcquisitions,
      averageLockTime,
      cacheHits: performanceMetrics.cacheHits,
      cacheMisses: performanceMetrics.cacheMisses,
    },
    eventLog: [...eventLog],
    configuration: {
      defaultOptions,
      i18nConfig: getI18nConfig(),
    },
  };
}

/**
 * 성능 리포트 생성
 */
export function generatePerformanceReport(): string {
  const debugInfo = getDebugInfo();
  const { performance } = debugInfo;
  
  const cacheHitRate = performance.cacheHits + performance.cacheMisses > 0
    ? (performance.cacheHits / (performance.cacheHits + performance.cacheMisses) * 100).toFixed(2)
    : '0';
  
  return `
📊 React History Stack Manager - Performance Report
================================================

📈 Operations:
  - Total Operations: ${performance.totalOperations}
  - Lock Acquisitions: ${performance.lockAcquisitions}
  - Average Lock Time: ${performance.averageLockTime.toFixed(2)}ms

💾 Cache Performance:
  - Cache Hits: ${performance.cacheHits}
  - Cache Misses: ${performance.cacheMisses}
  - Hit Rate: ${cacheHitRate}%

📋 Current Stack:
  - Stack Items: ${debugInfo.stackItems.length}
  - Items: ${debugInfo.stackItems.map(item => `${item.type}(${item.id})`).join(', ')}

📝 Recent Events (last 10):
${debugInfo.eventLog.slice(-10).map(entry => 
  `  ${new Date(entry.timestamp).toISOString()} [${entry.level.toUpperCase()}:${entry.category}] ${entry.message}`
).join('\n')}

Generated at: ${new Date().toISOString()}
  `.trim();
}

/**
 * 스택 상태 검증
 */
export function validateStackState(): { isValid: boolean; issues: string[] } {
  const stackItems = loadHisData();
  const issues: string[] = [];
  
  // 중복 closeKey 검사
  const closeKeys = stackItems.map(item => item.closeKey);
  const duplicateKeys = closeKeys.filter((key, index) => closeKeys.indexOf(key) !== index);
  if (duplicateKeys.length > 0) {
    issues.push(`Duplicate close keys found: ${duplicateKeys.join(', ')}`);
  }
  
  // 잘못된 타입 검사
  const validTypes = Object.keys(defaultOptions);
  const invalidTypes = stackItems.filter(item => !validTypes.includes(item.type));
  if (invalidTypes.length > 0) {
    issues.push(`Invalid component types: ${invalidTypes.map(item => item.type).join(', ')}`);
  }
  
  // 우선순위 검사
  const invalidPriorities = stackItems.filter(item => 
    typeof item.priority !== 'undefined' && (item.priority < 0 || item.priority > 100)
  );
  if (invalidPriorities.length > 0) {
    issues.push(`Invalid priorities (should be 0-100): ${invalidPriorities.map(item => item.priority).join(', ')}`);
  }
  
  // 생성 시간 검사
  const now = Date.now();
  const futureItems = stackItems.filter(item => 
    typeof item.createdAt !== 'undefined' && item.createdAt > now
  );
  if (futureItems.length > 0) {
    issues.push(`Items with future timestamps found: ${futureItems.length}`);
  }
  
  logEvent('info', 'stack', 'Stack state validation completed', { 
    isValid: issues.length === 0, 
    issues,
    stackItems: stackItems.length 
  });
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * 메모리 사용량 분석
 */
export function analyzeMemoryUsage(): { 
  stackSize: number; 
  logSize: number; 
  estimatedMemoryKB: number;
  recommendations: string[];
} {
  const stackItems = loadHisData();
  const stackSize = JSON.stringify(stackItems).length;
  const logSize = JSON.stringify(eventLog).length;
  const estimatedMemoryKB = (stackSize + logSize) / 1024;
  
  const recommendations: string[] = [];
  
  if (eventLog.length > 500) {
    recommendations.push('Consider reducing maxLogEntries to save memory');
  }
  
  if (stackItems.length > 10) {
    recommendations.push('Large stack detected - check for memory leaks');
  }
  
  if (estimatedMemoryKB > 100) {
    recommendations.push('High memory usage detected - consider cleanup');
  }
  
  logEvent('info', 'performance', 'Memory usage analyzed', {
    stackSize,
    logSize,
    estimatedMemoryKB,
    recommendations,
  });
  
  return {
    stackSize,
    logSize,
    estimatedMemoryKB,
    recommendations,
  };
}

/**
 * DevTools 확장 연결
 */
function connectToDevToolsExtension(): void {
  if (typeof window === 'undefined') return;
  
  // React DevTools 또는 Redux DevTools 확장 감지
  const extension = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ || 
                   (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  
  if (extension) {
    logEvent('info', 'stack', 'Connected to DevTools extension');
    
    // 확장에 초기 상태 전송
    sendToDevToolsExtension({
      timestamp: Date.now(),
      level: 'info',
      category: 'stack',
      message: 'History Stack Manager initialized',
      data: getDebugInfo(),
    });
  }
}

/**
 * DevTools 확장에 데이터 전송
 */
function sendToDevToolsExtension(entry: LogEntry): void {
  if (typeof window === 'undefined') return;
  
  const extension = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  if (extension && extension.send) {
    extension.send(
      `HistoryStack:${entry.category}:${entry.message}`,
      entry.data || {}
    );
  }
}

/**
 * 전역 윈도우 객체에 디버그 함수 노출 (개발 모드에서만)
 */
export function exposeGlobalDebugFunctions(): void {
  if (typeof window === 'undefined' || !isDevMode) return;
  
  (window as any).historyStackDebug = {
    getDebugInfo,
    generatePerformanceReport,
    validateStackState,
    analyzeMemoryUsage,
    enableDevMode,
    configurePerformanceMonitoring,
    logEvent,
  };
  
  console.log(
    '%c🔧 History Stack Debug Tools Available',
    'color: #2196F3; font-weight: bold; font-size: 14px;'
  );
  console.log(
    '%cUse window.historyStackDebug to access debugging functions',
    'color: #666; font-size: 12px;'
  );
  console.log('Available functions:', Object.keys((window as any).historyStackDebug));
}

/**
 * 자동 성능 모니터링 시작
 */
export function startAutoMonitoring(): void {
  if (typeof window === 'undefined') return;
  
  configurePerformanceMonitoring({ enabled: true });
  
  // 주기적으로 성능 체크
  setInterval(() => {
    const memoryAnalysis = analyzeMemoryUsage();
    const validation = validateStackState();
    
    if (!validation.isValid) {
      logEvent('warn', 'stack', 'Stack validation failed', validation.issues);
    }
    
    if (memoryAnalysis.estimatedMemoryKB > 50) {
      logEvent('warn', 'performance', 'High memory usage detected', memoryAnalysis);
    }
  }, 30000); // 30초마다
  
  logEvent('info', 'performance', 'Auto monitoring started');
}

/**
 * 개발자를 위한 유틸리티 함수들
 */
export const devUtils = {
  enableDevMode,
  configurePerformanceMonitoring,
  getDebugInfo,
  generatePerformanceReport,
  validateStackState,
  analyzeMemoryUsage,
  logEvent,
  updatePerformanceMetrics,
  exposeGlobalDebugFunctions,
  startAutoMonitoring,
}; 