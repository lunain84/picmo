import { Emoji } from 'emojibase';

import { View } from './view';
import classes from './Preview.scss';

import previewTemplate from 'templates/preview.ejs';
import customPreviewTemplate from 'templates/customPreview.ejs';
import { compileTemplate } from '../templates';

const renderTag = compileTemplate('<li class="<%= classes.tag %>"><%= tag %></li>');

export class EmojiPreview extends View {
  constructor() {
    super({ template: previewTemplate, classes });
  }

  initialize() {
    this.uiElements = {
      emoji: View.byClass(classes.previewEmoji), 
      name: View.byClass(classes.previewName),
      tagIcon: View.byClass(classes.tagIcon),
      tagList: View.byClass(classes.tagList)
    };

    this.bindAppEvents({
      'preview:show': this.showPreview,
      'preview:hide': this.showPreview
    });
  }

  private async getContent(emoji: Emoji): Promise<HTMLElement> {
    // TODO lazy load this too?
    // TODO fix custom emojis
    // if (emoji.custom) {
    //   return renderTemplate(customPreviewTemplate, {
    //     emoji: emoji.emoji
    //   });
    // }

    // TODO cache preview images to prevent refetching
    return this.renderer.render(emoji);
  }

  async showPreview(emoji: Emoji) {
    if (emoji) {
      const content = await this.getContent(emoji);
      this.ui.emoji.replaceChildren(content);
      this.ui.name.textContent = emoji.label;
      if (emoji.tags) {
        this.ui.tagIcon.style.display = 'block';
        this.ui.tagList.style.display = 'flex';
        const tags = await Promise.all(emoji.tags.map(tag => renderTag({ tag, classes })));
        this.ui.tagList.replaceChildren(...tags);
      }
    } else {
      this.ui.emoji.replaceChildren();
      this.ui.name.textContent = '';
      this.ui.tagIcon.style.display = 'none';
      this.ui.tagList.style.display = 'none';
    }
  }
}
