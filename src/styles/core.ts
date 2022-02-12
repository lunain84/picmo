export const coreStyles = {
  wrapper: {
    '--blue-color': '#4f81e5',
    '--border-radius': '5px',
    '--content-height': '22rem',
    '--emojis-per-row': '8',
    '--emoji-preview-size': '2.75em',
    '--emoji-size': '1.5em',
    '--emoji-size-multiplier': '1.5',
    '--category-button-height': '2em',
    '--category-button-size': '1.25em',
    '--category-border-bottom-size': '4px',
    '--search-height': '2em',
    '--overlay-background-color': 'rgba(0, 0, 0, 0.8)',
    '--emoji-font':
      "'Segoe UI Emoji', 'Segoe UI Symbol', 'Segoe UI', 'Apple Color Emoji', 'Twemoji Mozilla', 'Noto Color Emoji', 'EmojiOne Color', 'Android Emoji'",
    '--ui-font': '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif'
  },

  picker: {
    background: 'var(--background-color)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border-color)',
    fontFamily: 'var(--ui-font)',
    fontSize: '16px',
    overflow: 'hidden',
    position: 'relative',
    width: 'calc(var(--emojis-per-row) * var(--emoji-size) * var(--emoji-size-multiplier) + 1em + 1.5rem)',

    '& > *': {
      fontFamily: 'var(--ui-font)',
      boxSizing: 'content-box'
    }
  },

  overlay: {
    background: 'rgba(0, 0, 0, 0.75)',
    height: '100%',
    left: 0,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1000
  },

  content: {
    height: 'var(--content-height)',
    position: 'relative',
    overflow: 'hidden'
  },

  pluginContainer: {
    margin: '0.5em',
    display: 'flex',
    flexDirection: 'row'
  }
};

export type CoreKeys = keyof typeof coreStyles;
