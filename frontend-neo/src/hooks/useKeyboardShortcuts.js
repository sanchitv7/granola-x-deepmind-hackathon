import { useEffect } from 'react';

const useKeyboardShortcuts = (onReject, onAccept, disabled) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (disabled) return;

      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
        case 'x':
        case 'X':
          onReject();
          break;
        case 'ArrowRight':
        case 'Enter':
          onAccept();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onReject, onAccept, disabled]);
};

export default useKeyboardShortcuts;
