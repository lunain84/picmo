import { Renderer } from '../renderer';
import { EmojiRecord, EmojiSelection } from '../../types';
import { compileTemplateSync } from '../../templates';

import sprites from './sprites';
import classes from './twemoji.scss';

// TODO: show placeholders as each category loads
// TODO: cache this so it doesn't get requested more than once

const template = compileTemplateSync(`
  <svg width="1em" height="1em">
    <use href="/<%= url %>#<%= hexcode %>"></use>
  </svg>
`);

export class TwemojiSpriteRenderer extends Renderer {
  render(record: EmojiRecord, classNames = classes.twemoji) {
    const { hexcode, group } = record;
    return this.renderElement(template({ url: sprites[group], hexcode }));
  }

  async emit(record: EmojiRecord): Promise<EmojiSelection> {

  }
}
