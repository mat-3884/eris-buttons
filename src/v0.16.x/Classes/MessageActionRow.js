const MessageButton = require("./MessageButton");
const MessageSelectMenu = require("./MessageSelectMenu");
const { MessageComponentTypes } = require("../Constants");
const BaseMessageComponent = require("./interfaces/BaseMessageComponent");

class MessageActionRow extends BaseMessageComponent {
  constructor(data = {}) {
    super({ type: "ACTION_ROW" });
    this.setup(data);
  }

  setup(data) {
    this.components = [];
    if ("components" in data) {
      this.components = data.components.map((c) => BaseMessageComponent.create(c));
    }

    return this;
  }

  addComponents(...components) {
    this.components.push();
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
      components: this.components
        ? this.components.map((c) => {
            if (c instanceof MessageButton || c instanceof MessageSelectMenu) {
              return c;
            } else {
              switch (c.type) {
                case MessageComponentTypes.BUTTON:
                  return new MessageButton(c);
                case MessageComponentTypes.SELECT_MENU:
                  return new MessageSelectMenu(c);
              }
            }
          })
        : [],
      type: MessageComponentTypes[this.type]
    };
  }
}

module.exports = MessageActionRow;
