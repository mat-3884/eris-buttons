const { MessageComponentTypes } = require("../Constants.js");
const BaseMessageComponent = require("./interfaces/BaseMessageComponent");
const { resolveStyle } = require("../Util");

class MessageButton extends BaseMessageComponent {
  constructor(data = {}) {
    super({ type: "BUTTON" });
    this.setup(data);
  }

  setup(data) {
    this.style = "style" in data ? resolveStyle(data.style) : null;

    this.label = "label" in data && data.label ? data.label : undefined;

    this.disabled = "disabled" in data ? data.disabled : false;

    if (data.emoji) this.setEmoji(data.emoji);

    if ("url" in data && data.url) this.url = data.url;
    else this.url = undefined;

    if (("id" in data && data.id) || ("custom_id" in data && data.custom_id)) this.custom_id = data.id || data.custom_id;
    else this.custom_id = undefined;

    return this;
  }

  setStyle(style) {
    this.style = resolveStyle(style);
    return this;
  }

  setLabel(label) {
    this.label = label;
    return this;
  }

  setDisabled(disabled) {
    if (disabled === false) this.disabled = false;
    else this.disabled = true;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setID(id) {
    this.custom_id = id;
    return this;
  }

  setEmoji(emoji, animated) {
    if (!emoji) throw new Error("MISSING_EMOJI: On this option was used `.setEmoji` method without emoji");

    this.emoji = {
      id: undefined,
      name: undefined
    };

    if (!isNaN(emoji)) this.emoji.id = emoji;
    if (!isNaN(emoji.id)) this.emoji.id = emoji.id;
    if (emoji.name) this.emoji.name = emoji.name;

    if (!this.emoji.id && !this.emoji.name) this.emoji.name = emoji;

    if (typeof animated === "boolean") this.emoji.animated = animated;

    return this;
  }

  toJSON() {
    return {
      type: MessageComponentTypes.BUTTON,
      style: this.style,
      label: this.label,
      emoji: this.emoji,
      disabled: this.disabled,
      url: this.url,
      custom_id: this.custom_id
    };
  }
}

module.exports = MessageButton;
