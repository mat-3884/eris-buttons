import Eris, { PartialEmoji, Client, User, Channel, Guild, ComponentInteraction } from "eris";
import { EventEmitter } from "node:events";

declare module "eris" {
  export interface EventListeners {
    clickButton: [ComponentInteraction];
    clickSelectMenu: [ComponentInteraction];
  }

  export interface Message {
    createButtonCollector(filter: CollectorFilter, options?: AwaitMessageButtonOptions): ButtonCollector;
    awaitButtons(filter: CollectorFilter, options?: AwaitMessageButtonOptions): Promise<Map<Snowflake, MessageComponent>>;
    createSelectMenuCollector(filter: CollectorFilter, options?: AwaitMessageSelectMenuOptions): SelectMenuCollector;
    awaitSelectMenus(filter: CollectorFilter, options?: AwaitMessageSelectMenuOptions): Promise<Map<Snowflake, MessageComponent>>;
  }
}

export enum MessageComponentTypes {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT_MENU = 3
}

export enum MessageButtonStyles {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DESTRUCTIVE = 4,
  LINK = 5
}

/**
 * https://discord.com/developers/docs/reference#snowflakes
 */
export declare type Snowflake = string;

export type MessageComponent = BaseMessageComponent | MessageActionRow | MessageButton | MessageSelectMenu;

export type MessageActionRowComponents = MessageButton | MessageSelectMenu;

export type MessageButtonStyle = keyof typeof MessageButtonStyles;

export type MessageButtonStyleResolvable = MessageButtonStyle | MessageButtonStyles;

export type CollectorFilter = (interaction: ComponentInteraction) => boolean | Promise<boolean>;

export type Awaited<T> = T | Promise<T>;

export type Awaitable<T> = T | PromiseLike<T>;

export interface Message extends Eris.Message {
  createButtonCollector(filter: CollectorFilter, options?: AwaitMessageButtonOptions): ButtonCollector;
  awaitButtons(filter: CollectorFilter, options?: AwaitMessageButtonOptions): Promise<Map<Snowflake, MessageComponent>>;
  createSelectMenuCollector(filter: CollectorFilter, options?: AwaitMessageSelectMenuOptions): SelectMenuCollector;
  awaitSelectMenus(filter: CollectorFilter, options?: AwaitMessageSelectMenuOptions): Promise<Map<Snowflake, MessageComponent>>;
}

export interface CollectorResetTimerOptions {
  time?: number;
  idle?: number;
}

export interface CollectorOptions {
  time?: number;
  idle?: number;
  dispose?: boolean;
}

export interface MessageButtonOptions {
  type: MessageComponentTypes.BUTTON;
  style: MessageButtonStyleResolvable;
  label?: string;
  disabled?: boolean;
  emoji?: Partial<PartialEmoji>;
  url?: string;
  id?: string;
  custom_id?: string;
}

export interface MessageSelectMenuOptions {
  type: MessageComponentTypes.SELECT_MENU;
  label?: string;
  emoji?: Partial<PartialEmoji>;
  description?: string;
  value?: string;
}

export interface MessageButtonData {
  type?: MessageComponentTypes.BUTTON;
  style: MessageButtonStyles | number;
  label?: string;
  disabled?: boolean;
  emoji?: Partial<PartialEmoji>;
  url?: string;
  custom_id?: string;
}

export interface MessageActionRowData {
  type: MessageComponentTypes.ACTION_ROW;
  components: MessageActionRowComponents[];
}

export interface MessageSelectMenuData {
  type?: MessageComponentTypes.SELECT_MENU;
  placeholder?: string;
  custom_id?: string;
  max_values?: number;
  min_values?: number;
  options?: Array<MessageSelectMenuOptions>;
}

export interface MessageSelectMenuOptionsData {
  label?: string;
  emoji?: Partial<PartialEmoji>;
  description?: string;
  value?: string;
}

export interface MessageSelectMenuCollectorOptions extends CollectorOptions {
  max?: number;
  maxMenus?: number;
  maxUsers?: number;
}

export interface AwaitMessageSelectMenuOptions extends MessageSelectMenuCollectorOptions {
  errors?: string[];
}

export interface MessageButtonCollectorOptions extends CollectorOptions {
  max?: number;
  maxButtons?: number;
  maxUsers?: number;
}

export interface AwaitMessageButtonOptions extends MessageButtonCollectorOptions {
  errors?: string[];
}

export abstract class Collector<K, V> extends EventEmitter {
  constructor(client: Client, filter: CollectorFilter, options?: CollectorOptions);
  private _timeout: NodeJS.Timeout | null;
  private _idletimeout: NodeJS.Timeout | null;

  public readonly client: Client;
  public collected: Map<K, V>;
  public ended: boolean;
  public filter: CollectorFilter;
  public readonly next: Promise<V>;
  public options: CollectorOptions;
  public checkEnd(): void;
  public handleCollect(...args: any[]): void;
  public handleDispose(...args: any[]): void;
  public stop(reason?: string): void;
  public resetTimer(options?: { time?: number; idle?: number }): void;
  public [Symbol.asyncIterator](): AsyncIterableIterator<V>;
  public toJSON(): object;

  protected listener: (...args: any[]) => void;
  public abstract collect(...args: any[]): K;
  public abstract dispose(...args: any[]): K;
  public abstract endReason(): void;

  public on(event: "collect" | "dispose", listener: (...args: any[]) => void): this;
  public on(event: "end", listener: (collected: Map<K, V>, reason: string) => void): this;

  public once(event: "collect" | "dispose", listener: (...args: any[]) => void): this;
  public once(event: "end", listener: (collected: Map<K, V>, reason: string) => void): this;
}

export class ButtonCollector extends Collector<Snowflake, MessageComponent> {
  public endReason(): string | null;
  constructor(message: Message, filter: CollectorFilter, options?: MessageButtonCollectorOptions);
  message: Message;
  users: Map<Snowflake, User>;
  total: number;
  empty(): void;
  _handleChannelDeletion(channel: Channel): void;
  _handleGuildDeletion(guild: Guild): void;
  _handleMessageDeletion(message: Message): void;

  collect(button: MessageButton): Snowflake;
  dispose(button: MessageButton): Snowflake;
  on(event: "collect" | "dispose", listener: (interaction: ComponentInteraction) => Awaited<void>): this;
  on(event: "end", listener: (collected: Map<Snowflake, MessageComponent>, reason: string) => Awaited<void>): this;
  on(event: string, listener: (...data: any[]) => Awaited<void>): this;

  once(event: "collect" | "dispose", listener: (interaction: ComponentInteraction) => Awaited<void>): this;
  once(event: "end", listener: (collected: Map<Snowflake, MessageComponent>, reason: string) => Awaited<void>): this;
  once(event: string, listener: (...data: any[]) => Awaited<void>): this;
}

export class SelectMenuCollector extends Collector<Snowflake, MessageComponent> {
  constructor(data: any, filter: CollectorFilter, options?: MessageSelectMenuCollectorOptions);
  public message: Message;
  public users: Map<Snowflake, User>;
  public total: number;
  public _handleChannelDeletion(channel: Channel): void;
  public _handleGuildDeletion(guild: Guild): void;
  public _handleMessageDeletion(message: Message): void;

  public collect(menu: MessageSelectMenu): Snowflake;
  public dispose(menu: MessageSelectMenu): Snowflake;
  public empty(): void;
  public endReason(): string | null;

  on(event: "collect" | "dispose", listener: (interaction: ComponentInteraction) => Awaited<void>): this;
  on(event: "end", listener: (collected: Map<Snowflake, MessageComponent>, reason: string) => Awaited<void>): this;
  on(event: string, listener: (...data: any[]) => Awaited<void>): this;

  once(event: "collect" | "dispose", listener: (interaction: ComponentInteraction) => Awaited<void>): this;
  once(event: "end", listener: (collected: Map<Snowflake, MessageComponent>, reason: string) => Awaited<void>): this;
  once(event: string, listener: (...data: any[]) => Awaited<void>): this;
}

export class BaseMessageComponent {
  constructor(data: MessageActionRow | MessageButton);
  private static create(data: MessageActionRow | MessageButton): MessageActionRow | MessageButton;
}

export class MessageActionRow extends BaseMessageComponent {
  constructor(data?: {});
  setup(data: any): MessageActionRow;
  type: MessageComponentTypes.ACTION_ROW;
  component: MessageActionRowComponents[];
  components: MessageActionRowComponents[];
  addComponents(...components: MessageActionRowComponents[]): MessageActionRow;
  addComponent(component: MessageActionRowComponents): MessageActionRow;
  toJSON(): {
    components: MessageActionRowComponents[];
    type: MessageComponentTypes.ACTION_ROW;
  };
}

export class MessageButton extends BaseMessageComponent {
  constructor(data?: MessageButton | MessageButtonData | MessageButtonOptions);
  public setup(data: any): MessageButton;
  public type: MessageComponentTypes.BUTTON;
  public style: MessageButtonStyles;
  public label: string;
  public disabled: boolean;
  public emoji: Partial<PartialEmoji>;
  public url: string;
  public custom_id: string;
  public setStyle(style: MessageButtonStyleResolvable): MessageButton;
  public setLabel(label: string): MessageButton;
  public setDisabled(disabled?: boolean): MessageButton;
  public setURL(url: string): MessageButton;
  public setID(id: string): MessageButton;
  public setEmoji(emoji: any): MessageButton;
  public toJSON(): MessageButtonData;
}

export class MessageSelectMenu extends BaseMessageComponent {
  constructor(data?: any);
  public placeholder: string;
  public max_values: number;
  public min_values: number;
  public options: MessageSelectMenuOption[];
  public custom_id: string;
  public type: MessageComponentTypes.SELECT_MENU;
  public setup(data: any): MessageSelectMenu;
  public setPlaceholder(label: string): MessageSelectMenu;
  public setID(id: string): MessageSelectMenu;
  public setMaxValues(number: number): MessageSelectMenu;
  public setMinValues(number: number): MessageSelectMenu;
  public addOption(option: MessageSelectMenuOption): MessageSelectMenu;
  public addOptions(...options: MessageSelectMenuOption[]): MessageSelectMenu;
  public removeOptions(index: number, deleteCount: number, ...options: MessageSelectMenuOption[]): MessageSelectMenu;
  public toJSON(): MessageSelectMenuData;
}

export class MessageSelectMenuOption extends BaseMessageComponent {
  constructor(data?: MessageSelectMenuOptionsData);
  public default: boolean;
  public description: string;
  public emoji: Partial<PartialEmoji>;
  public label: string;
  public value: string;
  public type: "SELECT_MENU_OPTION";
  public setup(data: MessageSelectMenuOptions): MessageSelectMenuOption;
  public setLabel(label: string): MessageSelectMenuOption;
  public setValue(value: string): MessageSelectMenuOption;
  public setDescription(value: string): MessageSelectMenuOption;
  public setDefault(def?: boolean): MessageSelectMenuOption;
  public setEmoji(emoji: Partial<PartialEmoji>): MessageSelectMenuOption;
  public toJSON(): MessageSelectMenuOptionsData;
}

declare module "eris-buttons" {
  export default function (client: Client): void;
}
