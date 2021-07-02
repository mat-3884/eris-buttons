const { MessageComponentTypes } = require('../Constants.js');
const BaseMessageComponent = require('./interfaces/BaseMessageComponent');
const { resolveString } = require('discord.js').Util;
const { isEmoji } = require('../Util');

class MessageMenuOption extends BaseMessageComponent {
  constructor(data = {}) {
    super({ type: 'BUTTON' });
    this.setup(data);
  }

  setup(data) {
    this.label = 'label' in data && data.label ? resolveString(data.label) : undefined;

    this.value = 'value' in data && data.value ? resolveString(data.value) : undefined;

    if ('emoji' in data) this.setEmoji(data.emoji);

    this.description = 'description' in data ? data.description : undefined;

    return this;
  }

  setLabel(label) {
    this.label = resolveString(label);
    return this;
  }

  setValue(value) {
    this.value = resolveString(value);
    return this;
  }

  setDescription(value) {
    this.description = resolveString(value);
    return this;
  }

  setDefault(def = true) {
    this.default = def;
    return this;
  }

  setEmoji(emoji, animated) {
    if (!emoji) throw new Error('MISSING_EMOJI: On this option was used `.setEmoji` method without emoji');

    this.emoji = {
      id: undefined,
      name: undefined,
    };

    if (!isNaN(emoji)) this.emoji.id = emoji;
    if (!isNaN(emoji.id)) this.emoji.id = emoji.id;
    if (emoji.name) this.emoji.name = emoji.name;

    if (!this.emoji.id && !this.emoji.name) this.emoji.name = emoji;

    if (typeof animated === 'boolean') this.emoji.animated = animated;

    return this;
  }

  toJSON() {
    return {
      label: this.label,
      value: this.value,
      default: this.default,
      emoji: this.emoji,
      description: this.description,
    };
  }
}

module.exports = MessageMenuOption;
