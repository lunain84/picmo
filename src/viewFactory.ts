import { AppEvent } from './AppEvents';
import { Database } from './db';
import { Events } from './events';
import { Bundle } from './i18n';
import { Renderer } from './renderers/renderer';
import { PickerOptions } from './types';
import { View } from './views/view';

type DependencyMapping = {
  events: Events<AppEvent>;
  i18n: Bundle;
  renderer: Renderer;
  emojiData: Promise<Database>;
  options: Required<PickerOptions>;
};

type ViewConstructor<T extends View> = new (...args: any[]) => T;
type ViewConstructorParameters<T extends View> = ConstructorParameters<ViewConstructor<T>>;

export class ViewFactory {
  private events: Events<AppEvent>;
  private i18n: Bundle;
  private renderer: Renderer;
  private emojiData: Promise<Database>;
  private options: Required<PickerOptions>;

  constructor({ events, i18n, renderer, emojiData, options }: DependencyMapping) {
    this.events = events;
    this.i18n = i18n;
    this.renderer = renderer;
    this.emojiData = emojiData;
    this.options = options;
  }

  create<T extends View>(constructor: ViewConstructor<T>, ...args: ViewConstructorParameters<T>): T {
    const view = new constructor(...args);
    
    view.setEvents(this.events);
    view.setI18n(this.i18n);
    view.setRenderer(this.renderer);
    view.setEmojiData(this.emojiData);
    view.setOptions(this.options);

    view.viewFactory = this;

    view.initialize();
    return view;
  }
}
