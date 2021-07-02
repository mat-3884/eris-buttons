const MessageButton = require('./MessageButton');
const MessageMenu = require('./MessageMenu');
const { MessageComponentTypes } = require('../Constants');
const BaseMessageComponent = require('./interfaces/BaseMessageComponent');

class MessageActionRow extends BaseMessageComponent {
  constructor(data = {}) {
    super({ type: 'ACTION_ROW' });
    this.setup(data);
  }

  setup(data) {
    if ('component' in data) {
      this.component = BaseMessageComponent.create(component);
    }

    this.components = [];
    if ('components' in data) {
      this.components = data.components.map((c) => BaseMessageComponent.create(c));
    }

    return this;
  }

  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map((c) => BaseMessageComponent.create(c)));
    return this;
  }

  addComponent(component) {
    return this.addComponents(component);
  }

  removeComponents(index, deleteCount, ...components) {
    this.components.splice(index, deleteCount, ...components.flat(Infinity).map((c) => BaseMessageComponent.create(c)));
    return this;
  }

  toJSON() {
    return {
      components: this.components ? this.components.map((c) => (c instanceof MessageButton || c instanceof MessageMenu ? c.toJSON() : c)) : undefined,
      type: MessageComponentTypes[this.type],
    };
  }
}

module.exports = MessageActionRow;
