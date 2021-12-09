const { Message } = require('eris');
const ButtonCollector = require('./ButtonCollector');
const SelectMenuCollector = require('./SelectMenuCollector');
const BaseMessageComponent = require('./interfaces/BaseMessageComponent');

class ExtendedMessage extends Message {
  _patch(data) {
    super._patch(data);
    if (data.components && Array.isArray(data.components) && data.components.length > 0) {
      this.components = data.components.map((c) => BaseMessageComponent.create(c));
    } else {
      this.components = [];
    }
    return this;
  }

  createButtonCollector(filter, options = {}) {
    return new ButtonCollector(this, filter, options);
  }

  awaitButtons(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createButtonCollector(filter, options);
      collector.once('end', (buttons, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(buttons);
        } else {
          resolve(buttons);
        }
      });
    });
  }

  createSelectMenuCollector(filter, options = {}) {
    return new SelectMenuCollector(this, filter, options);
  }

  awaitSelectMenus(filter, options = {}) {
    return new Promise((resolve, reject) => {
      const collector = this.createSelectMenuCollector(filter, options);
      collector.once('end', (menus, reason) => {
        if (options.errors && options.errors.includes(reason)) {
          reject(menus);
        } else {
          resolve(menus);
        }
      });
    });
  }
}

module.exports = ExtendedMessage;
