import template from '../templates/emojiCategory.ejs';

import { BaseEmojiCategory } from './BaseEmojiCategory';
import { EmojiContainer } from './EmojiContainer';
import { LazyLoader } from '../LazyLoader';

import { Category } from '../types';

type EmojiCategoryOptions = {
  category: Category;
  showVariants: boolean;
  lazyLoader?: LazyLoader;
};
export class EmojiCategory extends BaseEmojiCategory {
  constructor({ category, showVariants, lazyLoader }: EmojiCategoryOptions) {
    super({ category, showVariants, lazyLoader, template });

    this.showVariants = showVariants;
    this.lazyLoader = lazyLoader;
  }

  initialize() {
    this.uiElements = { ...this.baseUIElements };
    super.initialize();
  }

async render(): Promise<HTMLElement> {
    const emojis = await this.emojiData.getEmojis(this.category, this.options.emojiVersion);

    this.emojiContainer = this.viewFactory.create(EmojiContainer, {
      emojis,
      showVariants: this.showVariants,
      lazyLoader: this.lazyLoader,
      category: this.category.key
    });

    return super.render({
      category: this.category,
      emojis: this.emojiContainer,
      emojiCount: emojis.length
    });
  }
}
