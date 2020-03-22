import { TinyEmitter as Emitter } from 'tiny-emitter';

import emojiData from './data/emoji';
import { i18n as defaultI18n } from './i18n';

import { CategoryButtons } from './categoryButtons';
import { EmojiContainer } from './emojiContainer';

import { CATEGORY_CLICKED } from './events';
import { I18NStrings, EmojiButtonOptions, EmojiRecord } from './types';
import { createElement } from './util';

const categories: string[] = emojiData.categories;

const emojiCategories: { [key: string]: EmojiRecord[] } = {};
emojiData.emoji.forEach(emoji => {
  let categoryList = emojiCategories[categories[emoji.category]];
  if (!categoryList) {
    categoryList = emojiCategories[categories[emoji.category]] = [];
  }

  categoryList.push(emoji);
});

const SCROLL_ANIMATION_TIME = 100;
const SCROLL_ANIMATION_INTERVAL = 25;
const SCROLL_ANIMATION_STEPS =
  SCROLL_ANIMATION_TIME / SCROLL_ANIMATION_INTERVAL;

export class EmojiArea {
  private animationQueue: FrameRequestCallback[] = [];
  private headerOffsets: number[];
  private currentCategory = 0;
  private headers: HTMLElement[] = [];
  private container: HTMLElement;
  private emojis: HTMLElement;
  private categoryButtons: CategoryButtons;

  private isAnimating = false;

  constructor(
    private events: Emitter,
    private i18n: I18NStrings,
    private options: EmojiButtonOptions
  ) {}

  render(): HTMLElement {
    this.container = createElement('div', 'emoji-picker__emoji-area');

    this.categoryButtons = new CategoryButtons(this.options, this.events);
    this.container.appendChild(this.categoryButtons.render());

    this.emojis = createElement('div', 'emoji-picker__emojis');
    Object.keys(emojiCategories).forEach(this.addCategory);

    requestAnimationFrame(() => {
      this.headerOffsets = Array.prototype.map.call(
        this.headers,
        header => header.offsetTop
      ) as number[];
    });

    this.emojis.addEventListener('scroll', this.highlightCategory);
    this.events.on(CATEGORY_CLICKED, this.selectCategory);

    this.container.appendChild(this.emojis);
    return this.container;
  }

  private addCategory = (category: string): void => {
    const name = createElement('h2', 'emoji-picker__category-name');
    name.innerHTML =
      this.i18n.categories[category] || defaultI18n.categories[category];
    this.emojis.appendChild(name);
    this.headers.push(name);

    this.emojis.appendChild(
      new EmojiContainer(
        emojiCategories[category],
        true,
        this.events,
        this.options
      ).render()
    );
  };

  selectCategory = (category: string): void =>  {
    const headerIndex = categories.indexOf(category);
    const targetPosition = this.headerOffsets[headerIndex];
    this.emojis.scrollTop = targetPosition;
  }

  // Animation code that I couldn't quite get working yet. Maybe someday
  // will do animation.
  // selectCategory = (category: string): void => {
  //   const headerIndex = categories.indexOf(category);
  //   const targetPosition = this.headerOffsets[headerIndex];

  //   const stepAnimate = (step: number): void => {
  //     console.log('stepAnimate');
  //     console.log('targetPosition:', targetPosition);
  //     console.log('currentPosition:', this.emojis.scrollTop);
  //     console.log('step:', step);

  //     this.isAnimating = true;

  //     if (this.emojis.scrollTop !== targetPosition) {
  //       if (Math.abs(this.emojis.scrollTop - targetPosition) <= Math.abs(step)) {
  //         this.emojis.scrollTop = targetPosition;
  //         console.log('done animating');
  //         requestAnimationFrame(() => this.isAnimating = false);
  //       } else {
  //         console.log('adding step of:', step);
  //         this.emojis.scrollTop += step;
  //         console.log('new position:', this.emojis.scrollTop);
  //         setTimeout(
  //           () => requestAnimationFrame(() => stepAnimate(step)),
  //           SCROLL_ANIMATION_INTERVAL
  //         );
  //       }
  //     } else {
  //       console.log('done animating');
  //       this.isAnimating = false;
  //     }
  //   };

  //   this.categoryButtons.setActiveButton(headerIndex);
    
  //   if (!this.isAnimating && !this.animationQueue.length) {
  //     console.log('doing immediate animation');
  //     requestAnimationFrame(() => stepAnimate((targetPosition - this.emojis.scrollTop) / SCROLL_ANIMATION_STEPS));
  //   } else {
  //     console.log('queueing animation');
  //     this.animationQueue.push(() => stepAnimate((targetPosition - this.emojis.scrollTop) / SCROLL_ANIMATION_STEPS));

  //     const checkQueue = (): void => {
  //       console.log('checking queue');
  //       if (this.animationQueue.length && !this.isAnimating) {
  //         const next = this.animationQueue.shift();
  //         console.log('found a task, scheduling via requestAnimationFrame');
  //         next && requestAnimationFrame(next);
  //       }

  //       if (this.animationQueue.length) {
  //         console.log('more entries remain, checking again in 50ms');
  //         setTimeout(checkQueue, 50);
  //       }
  //     }

  //     console.log('scheduling first queue check');
  //     setTimeout(checkQueue, 50);
  //   }
  // };

  highlightCategory = (): void => {
    if (!this.isAnimating) {
      let closestHeaderIndex = this.headerOffsets.findIndex(
        offset => offset > this.emojis.scrollTop
      );

      if (closestHeaderIndex === 0) {
        closestHeaderIndex = 1;
      } else if (closestHeaderIndex < 0) {
        closestHeaderIndex = this.headerOffsets.length;
      }

      this.currentCategory = closestHeaderIndex - 1;
      this.categoryButtons.setActiveButton(this.currentCategory);
    }
  };
}