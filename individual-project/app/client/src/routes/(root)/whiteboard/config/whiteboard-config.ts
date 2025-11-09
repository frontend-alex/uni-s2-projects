/**
 * Whiteboard Configuration
 * 
 * Centralized configuration for whiteboard controls, keyboard shortcuts, and settings.
 * All whiteboard-related constants and configuration should be defined here for
 * easy maintenance and consistency.
 * 
 * @module whiteboard/config/whiteboard-config
 */

/**
 * Main whiteboard configuration object
 * 
 * Contains all configurable settings for the whiteboard, including:
 * - Keyboard shortcuts
 * - Node defaults (dimensions, colors, labels)
 * - History management settings
 * - Toolbar configuration
 * - Resizer settings
 */
export const WHITEBOARD_CONFIG = {
  /**
   * Keyboard shortcuts configuration
   */
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
  /**
   * Node configuration
   */
  node: {
    /**
     * Default properties for each node type
     */
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
    /**
     * Minimum size constraints for nodes
     */
    minSize: {
      width: 50,
      height: 50,
    },
  },
  /**
   * History management configuration
   */
  history: {
    /**
     * Maximum number of history entries to keep
     * Higher values use more memory but allow more undo steps
     */
    maxHistorySize: 50,
  },
  /**
   * Toolbar configuration
   */
  toolbar: {
    colorPalette: {
      /**
       * Number of colors to display in the color palette
       */
      count: 6,
    },
    position: {
      /**
       * Vertical offset for toolbar position (negative = above node)
       */
      offsetY: -8,
    },
  },
  /**
   * Resizer configuration
   */
  resizer: {
    /**
     * Minimum width for resizable nodes
     */
    minWidth: 50,
    /**
     * Minimum height for resizable nodes
     */
    minHeight: 50,
  },
} as const;

/**
 * Check if a keyboard event matches a shortcut configuration.
 * 
 * Compares the keyboard event against a shortcut configuration to determine
 * if the shortcut was pressed. Handles platform differences (Ctrl vs Cmd).
 * 
 * @param event - Keyboard event to check
 * @param shortcut - Shortcut configuration to match against
 * @returns True if the event matches the shortcut, false otherwise
 * 
 * @example
 * ```typescript
 * if (matchesShortcut(event, WHITEBOARD_CONFIG.keyboard.shortcuts.undo)) {
 *   undo();
 * }
 * ```
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
 * Get platform-appropriate modifier key.
 * 
 * Returns 'meta' (Cmd on Mac) or 'ctrl' (Ctrl on Windows/Linux) based on
 * which modifier key is pressed in the event.
 * 
 * @param event - Keyboard event
 * @returns 'ctrl' or 'meta' based on platform
 * 
 * @example
 * ```typescript
 * const modifier = getModifierKey(event);
 * const isPressed = modifier === 'ctrl' ? event.ctrlKey : event.metaKey;
 * ```
 */
export function getModifierKey(event: KeyboardEvent): 'ctrl' | 'meta' {
  return event.metaKey ? 'meta' : 'ctrl';
}

/**
 * Check if the undo shortcut is pressed.
 * 
 * Supports both Ctrl+Z (Windows/Linux) and Cmd+Z (Mac).
 * Does not match Ctrl+Shift+Z (redo on some platforms).
 * 
 * @param event - Keyboard event to check
 * @returns True if undo shortcut is pressed, false otherwise
 * 
 * @example
 * ```typescript
 * if (isUndoShortcut(event)) {
 *   e.preventDefault();
 *   undo();
 * }
 * ```
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
 * Check if the redo shortcut is pressed.
 * 
 * Supports multiple redo shortcuts:
 * - Ctrl+Y / Cmd+Y (Windows/Linux/Mac)
 * - Ctrl+Shift+Z / Cmd+Shift+Z (alternative on some platforms)
 * 
 * @param event - Keyboard event to check
 * @returns True if redo shortcut is pressed, false otherwise
 * 
 * @example
 * ```typescript
 * if (isRedoShortcut(event)) {
 *   e.preventDefault();
 *   redo();
 * }
 * ```
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
 * Check if the copy shortcut is pressed.
 * 
 * Supports both Ctrl+C (Windows/Linux) and Cmd+C (Mac).
 * 
 * @param event - Keyboard event to check
 * @returns True if copy shortcut is pressed, false otherwise
 * 
 * @example
 * ```typescript
 * if (isCopyShortcut(event) && selectedNodes.length > 0) {
 *   e.preventDefault();
 *   copyNodes(selectedNodes);
 * }
 * ```
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
 * Check if the paste shortcut is pressed.
 * 
 * Supports both Ctrl+V (Windows/Linux) and Cmd+V (Mac).
 * 
 * @param event - Keyboard event to check
 * @returns True if paste shortcut is pressed, false otherwise
 * 
 * @example
 * ```typescript
 * if (isPasteShortcut(event) && copiedNodes.length > 0) {
 *   e.preventDefault();
 *   pasteNodes(copiedNodes);
 * }
 * ```
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
 * Check if the delete shortcut is pressed.
 * 
 * Matches both Delete and Backspace keys, but only when no modifiers are pressed.
 * 
 * @param event - Keyboard event to check
 * @returns True if delete shortcut is pressed, false otherwise
 * 
 * @example
 * ```typescript
 * if (isDeleteShortcut(event) && selectedNodes.length > 0) {
 *   e.preventDefault();
 *   deleteNodes(selectedNodes);
 * }
 * ```
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
