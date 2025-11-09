/**
 * Whiteboard Configuration
 * Centralized configuration for whiteboard controls, keyboard shortcuts, and settings
 */

export const WHITEBOARD_CONFIG = {
  keyboard: {
    shortcuts: {
      undo: {
        key: 'z',
        modifier: 'ctrl',
        description: 'Undo last action',
      },
      redo: {
        key: 'y',
        modifier: 'ctrl',
        description: 'Redo last action',
      },
      copy: {
        key: 'c',
        modifier: 'ctrl',
        description: 'Copy selected nodes',
      },
      paste: {
        key: 'v',
        modifier: 'ctrl',
        description: 'Paste copied nodes',
      },
      delete: {
        key: 'Delete',
        modifier: null,
        description: 'Delete selected nodes',
      },
      backspace: {
        key: 'Backspace',
        modifier: null,
        description: 'Delete selected nodes',
      },
    },
  },
  node: {
    defaults: {
      rectangle: {
        width: 150,
        height: 100,
        color: '#ffffff',
        label: '',
        name: '',
      },
      circle: {
        size: 100,
        color: '#ffffff',
        label: '',
        name: '',
      },
      diamond: {
        size: 100,
        color: '#ffffff',
        label: '',
        name: '',
      },
    },
    minSize: {
      width: 50,
      height: 50,
    },
  },
  history: {
    maxHistorySize: 50,
  },
  toolbar: {
    colorPalette: {
      count: 6,
    },
    position: {
      offsetY: -8,
    },
  },
  resizer: {
    minWidth: 50,
    minHeight: 50,
  },
} as const;

/**
 * Check if a keyboard event matches a shortcut configuration
 */
export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: { key: string; modifier: 'ctrl' | 'meta' | 'shift' | 'alt' | null }
): boolean {
  const keyMatches = event.key === shortcut.key || event.key.toLowerCase() === shortcut.key.toLowerCase();
  
  if (!keyMatches) return false;
  
  switch (shortcut.modifier) {
    case 'ctrl':
      return event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
    case 'meta':
      return event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
    case 'shift':
      return event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey;
    case 'alt':
      return event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
    case null:
      return !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
    default:
      return false;
  }
}

/**
 * Get platform-appropriate modifier key (Ctrl on Windows/Linux, Cmd on Mac)
 */
export function getModifierKey(event: KeyboardEvent): 'ctrl' | 'meta' {
  return event.metaKey ? 'meta' : 'ctrl';
}

/**
 * Check if the undo shortcut is pressed
 */
export function isUndoShortcut(event: KeyboardEvent): boolean {
  const modifier = getModifierKey(event);
  return (
    (modifier === 'ctrl' ? event.ctrlKey : event.metaKey) &&
    (event.key === 'z' || event.key === 'Z') &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Check if the redo shortcut is pressed
 */
export function isRedoShortcut(event: KeyboardEvent): boolean {
  const modifier = getModifierKey(event);
  return (
    ((modifier === 'ctrl' ? event.ctrlKey : event.metaKey) &&
      (event.key === 'y' || event.key === 'Y') &&
      !event.shiftKey &&
      !event.altKey) ||
    ((modifier === 'ctrl' ? event.ctrlKey : event.metaKey) &&
      event.shiftKey &&
      (event.key === 'z' || event.key === 'Z') &&
      !event.altKey)
  );
}

/**
 * Check if the copy shortcut is pressed
 */
export function isCopyShortcut(event: KeyboardEvent): boolean {
  const modifier = getModifierKey(event);
  return (
    (modifier === 'ctrl' ? event.ctrlKey : event.metaKey) &&
    (event.key === 'c' || event.key === 'C') &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Check if the paste shortcut is pressed
 */
export function isPasteShortcut(event: KeyboardEvent): boolean {
  const modifier = getModifierKey(event);
  return (
    (modifier === 'ctrl' ? event.ctrlKey : event.metaKey) &&
    (event.key === 'v' || event.key === 'V') &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * Check if the delete shortcut is pressed
 */
export function isDeleteShortcut(event: KeyboardEvent): boolean {
  return (
    (event.key === 'Delete' || event.key === 'Backspace') &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.shiftKey
  );
}
