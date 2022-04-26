import './EmojiButton.css';
import { createPicker } from '../../src/index';

import { Template } from '../Template';

function getUIFlags(options: any) {
  const flags = {
    showRecents: false,
    showCategoryTabs: false,
    showSearch: false,
    showVariants: false,
    showPreview: false
  };

  if (options.uiElements) {
    options.uiElements.forEach(element => {
      flags[element] = true;
    })
  }

  return flags;
}

function handleEmojiSelection(button: HTMLButtonElement) {
  return selection => {
    const { emoji, url } = selection;
    button.classList.remove('empty');

    if (url) {
      const img = document.createElement('img');
      img.src = url;
      button.replaceChildren(img);
    } else {
      button.replaceChildren(emoji);
    }
  };
}

export function renderPicker(options: any = {}) {
  const rootElement = new Template(() => /* html */`
    <div>
      <button class="emoji-button empty"></button>
      <div class="picker"></div>
    </div>
  `).renderSync();

  const button = rootElement.querySelector<HTMLButtonElement>('.emoji-button');
  const pickerElement = rootElement.querySelector<HTMLElement>('.picker');

  const picker = createPicker({
    ...options,
    ...getUIFlags(options),
    rootElement: pickerElement
  });

  picker.addEventListener('emoji:select', handleEmojiSelection(button));
  picker.addEventListener('emoji:select', options.emojiSelect);
  return rootElement;
}
