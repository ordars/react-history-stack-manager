import { I18nMessages, SupportedLocale, I18nConfig } from './types';

/**
 * 기본 메시지 (한국어)
 */
const defaultMessages: I18nMessages = {
  opened: '{type}이(가) 열렸습니다. ESC 키를 눌러 닫을 수 있습니다.',
  closed: '{type}이(가) 닫혔습니다.',
  escapeHint: 'ESC 키를 눌러 닫을 수 있습니다.',
  unknownType: '알 수 없는 타입 "{type}"입니다. 히스토리 스택 관리를 건너뜁니다.',
  saveError: '히스토리 데이터를 localStorage에 저장하는데 실패했습니다',
  loadError: 'localStorage에서 히스토리 데이터를 로드하는데 실패했습니다',
  clearError: '히스토리 데이터를 초기화하는데 실패했습니다',
  popstateError: 'popstate 핸들러에서 오류가 발생했습니다',
  escapeKeyError: 'ESC 키 핸들러에서 오류가 발생했습니다',
  closeError: 'close 함수 실행 중 오류가 발생했습니다',
  lockTimeout: '락 획득 시간이 초과되었습니다. 어쨌든 진행합니다.',
  focusRestoreError: '포커스 복원에 실패했습니다',
  dispatchEventError: 'historyStackChanged 이벤트 발생에 실패했습니다',
  historyPushError: 'history에 상태를 추가하는데 실패했습니다',
};

/**
 * 언어별 메시지
 */
const messages: Record<SupportedLocale, I18nMessages> = {
  ko: defaultMessages,
  
  en: {
    opened: '{type} has been opened. Press ESC key to close.',
    closed: '{type} has been closed.',
    escapeHint: 'Press ESC key to close.',
    unknownType: 'Unknown type "{type}" in defaultOptions. Skipping history stack management.',
    saveError: 'Failed to save history data to localStorage',
    loadError: 'Failed to load history data from localStorage',
    clearError: 'Failed to clear history data',
    popstateError: 'Error in popstate handler',
    escapeKeyError: 'Error in escape key handler',
    closeError: 'Error executing close function',
    lockTimeout: 'Lock acquisition timeout. Proceeding anyway.',
    focusRestoreError: 'Failed to restore focus',
    dispatchEventError: 'Failed to dispatch historyStackChanged event',
    historyPushError: 'Failed to push state to history',
  },
  
  ja: {
    opened: '{type}が開かれました。ESCキーで閉じることができます。',
    closed: '{type}が閉じられました。',
    escapeHint: 'ESCキーで閉じることができます。',
    unknownType: '不明なタイプ "{type}" です。履歴スタック管理をスキップします。',
    saveError: '履歴データをlocalStorageに保存できませんでした',
    loadError: 'localStorageから履歴データを読み込めませんでした',
    clearError: '履歴データをクリアできませんでした',
    popstateError: 'popstateハンドラーでエラーが発生しました',
    escapeKeyError: 'ESCキーハンドラーでエラーが発生しました',
    closeError: 'close関数の実行中にエラーが発生しました',
    lockTimeout: 'ロック取得がタイムアウトしました。とにかく続行します。',
    focusRestoreError: 'フォーカスの復元に失敗しました',
    dispatchEventError: 'historyStackChangedイベントの発生に失敗しました',
    historyPushError: 'historyに状態を追加できませんでした',
  },
  
  'zh-CN': {
    opened: '{type}已打开。按ESC键可以关闭。',
    closed: '{type}已关闭。',
    escapeHint: '按ESC键可以关闭。',
    unknownType: '未知类型 "{type}"。跳过历史堆栈管理。',
    saveError: '无法将历史数据保存到localStorage',
    loadError: '无法从localStorage加载历史数据',
    clearError: '无法清除历史数据',
    popstateError: 'popstate处理程序中发生错误',
    escapeKeyError: 'ESC键处理程序中发生错误',
    closeError: '执行close函数时发生错误',
    lockTimeout: '锁获取超时。无论如何继续进行。',
    focusRestoreError: '无法恢复焦点',
    dispatchEventError: '无法分发historyStackChanged事件',
    historyPushError: '无法向history添加状态',
  },
  
  es: {
    opened: '{type} se ha abierto. Presiona la tecla ESC para cerrar.',
    closed: '{type} se ha cerrado.',
    escapeHint: 'Presiona la tecla ESC para cerrar.',
    unknownType: 'Tipo desconocido "{type}". Omitiendo gestión de pila de historial.',
    saveError: 'Error al guardar datos del historial en localStorage',
    loadError: 'Error al cargar datos del historial desde localStorage',
    clearError: 'Error al limpiar datos del historial',
    popstateError: 'Error en el manejador popstate',
    escapeKeyError: 'Error en el manejador de tecla ESC',
    closeError: 'Error ejecutando función close',
    lockTimeout: 'Tiempo de espera para adquirir el bloqueo. Continuando de todos modos.',
    focusRestoreError: 'Error al restaurar el foco',
    dispatchEventError: 'Error al enviar evento historyStackChanged',
    historyPushError: 'Error al agregar estado al historial',
  },
  
  fr: {
    opened: '{type} a été ouvert. Appuyez sur la touche ESC pour fermer.',
    closed: '{type} a été fermé.',
    escapeHint: 'Appuyez sur la touche ESC pour fermer.',
    unknownType: 'Type inconnu "{type}". Gestion de la pile d\'historique ignorée.',
    saveError: 'Échec de la sauvegarde des données d\'historique dans localStorage',
    loadError: 'Échec du chargement des données d\'historique depuis localStorage',
    clearError: 'Échec de l\'effacement des données d\'historique',
    popstateError: 'Erreur dans le gestionnaire popstate',
    escapeKeyError: 'Erreur dans le gestionnaire de touche ESC',
    closeError: 'Erreur lors de l\'exécution de la fonction close',
    lockTimeout: 'Délai d\'acquisition du verrou dépassé. Poursuite quand même.',
    focusRestoreError: 'Échec de la restauration du focus',
    dispatchEventError: 'Échec de l\'envoi de l\'événement historyStackChanged',
    historyPushError: 'Échec de l\'ajout d\'état à l\'historique',
  },
  
  de: {
    opened: '{type} wurde geöffnet. Drücken Sie die ESC-Taste zum Schließen.',
    closed: '{type} wurde geschlossen.',
    escapeHint: 'Drücken Sie die ESC-Taste zum Schließen.',
    unknownType: 'Unbekannter Typ "{type}". Historie-Stack-Verwaltung wird übersprungen.',
    saveError: 'Fehler beim Speichern der Historiendaten in localStorage',
    loadError: 'Fehler beim Laden der Historiendaten aus localStorage',
    clearError: 'Fehler beim Löschen der Historiendaten',
    popstateError: 'Fehler im popstate-Handler',
    escapeKeyError: 'Fehler im ESC-Tasten-Handler',
    closeError: 'Fehler beim Ausführen der close-Funktion',
    lockTimeout: 'Zeitüberschreitung bei der Sperren-Akquisition. Trotzdem fortfahren.',
    focusRestoreError: 'Fehler beim Wiederherstellen des Fokus',
    dispatchEventError: 'Fehler beim Senden des historyStackChanged-Events',
    historyPushError: 'Fehler beim Hinzufügen des Status zur Historie',
  },
};

/**
 * 현재 설정
 */
let currentConfig: I18nConfig = {
  locale: 'ko',
};

/**
 * 다국어 설정 업데이트
 */
export function setI18nConfig(config: Partial<I18nConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * 현재 다국어 설정 반환
 */
export function getI18nConfig(): I18nConfig {
  return { ...currentConfig };
}

/**
 * 브라우저 언어 감지
 */
export function detectBrowserLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en';
  
  const lang = navigator.language || (navigator as any).userLanguage || 'en';
  
  // 지원되는 언어 중에서 찾기
  const supportedLocales = Object.keys(messages) as SupportedLocale[];
  
  // 정확한 매치 찾기
  if (supportedLocales.includes(lang as SupportedLocale)) {
    return lang as SupportedLocale;
  }
  
  // 언어 코드만으로 매치 (예: en-US -> en)
  const primaryLang = lang.split('-')[0];
  if (supportedLocales.includes(primaryLang as SupportedLocale)) {
    return primaryLang as SupportedLocale;
  }
  
  return 'en'; // 기본값
}

/**
 * 메시지 번역 함수
 */
export function t(key: keyof I18nMessages, variables?: Record<string, string>): string {
  const locale = currentConfig.locale;
  const customMessages = currentConfig.messages;
  
  // 커스텀 메시지가 있으면 우선 사용
  let message = customMessages?.[key] || messages[locale]?.[key] || messages.en[key];
  
  // 변수 치환
  if (variables) {
    Object.entries(variables).forEach(([varKey, varValue]) => {
      message = message.replace(new RegExp(`\\{${varKey}\\}`, 'g'), varValue);
    });
  }
  
  return message;
}

/**
 * 다국어 지원 콘솔 warn
 */
export function warn(key: keyof I18nMessages, variables?: Record<string, string>): void {
  console.warn(t(key, variables));
}

/**
 * 자동 언어 감지 및 설정
 */
export function autoDetectAndSetLocale(): void {
  const detectedLocale = detectBrowserLocale();
  setI18nConfig({ locale: detectedLocale });
} 