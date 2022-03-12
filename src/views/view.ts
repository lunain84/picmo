import { Data } from 'ejs';

import { renderTemplate, ElementTemplate } from '../templates';
import { AppEvent, AppEventKey } from '../AppEvents';
import { Events, EventArgs, EventCallback, AsyncEventCallback } from '../events';
import { ViewFactory } from '../viewFactory';
import { Bundle } from '../i18n';
import { Renderer } from '../renderers/renderer';
import { Database } from '../db';
import { PickerOptions } from '../types';

type UIEventListenerBinding = {
  target?: string;
  event: string;
  handler: EventCallback;
  options?: AddEventListenerOptions;
};

type AppEvents = {
  [key in AppEvent]?: EventCallback | AsyncEventCallback;
};

type ClassMappings = Record<string, string>;
type UIElementSelectors = Record<string, string>;
type UIElementMappings = Record<string, HTMLElement>;
type Template = string | ElementTemplate;

type ViewOptions = {
  template: Template;
  classes?: ClassMappings;
};
export abstract class View {
  el: HTMLElement;

  private template: Template;
  private classes?: ClassMappings;

  protected appEvents: AppEvents = {};
  protected uiEvents: UIEventListenerBinding[] = [];
  protected uiElements: UIElementSelectors = {};
  protected emojiData: Database;
  protected options: Required<PickerOptions>;

  protected events: Events<AppEvent>;
  protected i18n: Bundle;
  protected renderer: Renderer;

  viewFactory: ViewFactory;

  ui: UIElementMappings = {};

  constructor({ template, classes }: ViewOptions) {
    this.template = template;
    this.classes = classes;
  }

  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  initialize() {
    this.bindAppEvents();
  }

  setEvents(events: Events<AppEvent>) {
    this.events = events;
  }

  emit(event: AppEventKey, ...args: EventArgs) {
    this.events.emit(event, ...args);
  }

  setI18n(i18n: Bundle) {
    this.i18n = i18n;
  }

  setRenderer(renderer: Renderer) {
    this.renderer = renderer;
  }

  setEmojiData(emojiDataPromise: Promise<Database>) {
    emojiDataPromise.then(emojiData => {
      this.emojiData = emojiData;
    });
  }

  setOptions(options: Required<PickerOptions>) {
    this.options = options;
  }

  async render(templateData: Data = {}): Promise<HTMLElement> {
    const templateFn =
      typeof this.template === 'string' ? async (data: Data) => await renderTemplate(this.template as string, data) : this.template;

    this.el = await templateFn({
      classes: this.classes,
      i18n: this.i18n,
      ...templateData
    });

    this.bindUIElements();
    this.bindListeners();

    return this.el;
  }

  private bindAppEvents() {
    Object.keys(this.appEvents).forEach(event => {
      this.events.on(event as AppEventKey, this.appEvents[event].bind(this));
    });
  }

  private bindUIElements() {
    this.ui = Object.keys(this.uiElements).reduce((result, key) => ({
      ...result,
      [key]: this.el.querySelector<HTMLElement>(this.uiElements[key])
    }), {});
  }

  private bindListeners() {
    this.uiEvents.forEach((binding: UIEventListenerBinding) => {
      binding.handler = binding.handler.bind(this);

      const target = binding.target ? this.ui[binding.target] : this.el;
      target.addEventListener(binding.event, binding.handler, binding.options);
    });
  }

  destroy() {
    this.uiEvents.forEach((binding: UIEventListenerBinding) => {
      this.el.removeEventListener(binding.event, binding.handler, binding.options);
    });
  }

  static childEvent(target: string, event: string, handler: EventCallback, options: AddEventListenerOptions = {}): UIEventListenerBinding {
    return { target, event, handler, options };
  }

  static uiEvent(event: string, handler: EventCallback, options: AddEventListenerOptions = {}): UIEventListenerBinding {
    return { event, handler, options };
  }

  static byClass(className: string): string {
    return `.${className}`;
  }
}
