const Eris = require('eris');
const Message = require('./v0.16.x/Classes/Message');
const { MessageComponentTypes } = require('./v0.16.x/Constants');

const version = require('eris').VERSION;

/**
 * @param {Eris.Client} client
 */
module.exports = (client) => {
  if (!version.startsWith('0.16')) {
    throw new Error('The eris version must be v0.16.0 or higher');
  }

  if (!client || !client instanceof Eris.Client) throw new Error("INVALID_CLIENT_PROVIDED: The Eris Client isn't provided or it's invalid.");

  const message = Eris.Message;
  if (!message.createButtonCollector || typeof message.createButtonCollector !== 'function') {
    Object.defineProperty(Eris, 'Message', { value: Message });
  }

  client.on('interactionCreate', (interaction) => {
    if (!(interaction instanceof Eris.ComponentInteraction)) return;

    switch (interaction.data.component_type) {
      case MessageComponentTypes.BUTTON:
        client.emit('clickButton', interaction);
        break;

      case MessageComponentTypes.SELECT_MENU:
        client.emit('clickMenu', interaction);
        break;

      default:
        client.emit('debug', `Got unknown interaction component type, ${interaction.data.component_type}`);
        break;
    }
  });
};

module.exports.multipleImport = (...clients) => {
  if (!version.startsWith('0.16')) {
    throw new Error('The Eris version must be v0.16.0 or higher');
  }

  const message = Eris.Message;
  if (!message.createButtonCollector || typeof message.createButtonCollector !== 'function') {
    Object.defineProperty(Eris, 'Message', { value: Message });
  }

  clients.forEach((client) => {
    if (!client || !client instanceof Eris.Client) throw new Error("INVALID_CLIENT_PROVIDED: The Eris Client isn't provided or it's invalid.");

    client.on('interactionCreate', (interaction) => {
      if (!(interaction instanceof Eris.ComponentInteraction)) return;

      switch (interaction.data.component_type) {
        case MessageComponentTypes.BUTTON:
          client.emit('clickButton', interaction);
          break;

        case MessageComponentTypes.SELECT_MENU:
          client.emit('clickMenu', interaction);
          break;
        default:
          client.emit('debug', `Got unknown interaction component type, ${interaction.data.component_type}`);
          break;
      }
    });
  });
};

module.exports.MessageButton = require(`./v0.16.x/Classes/MessageButton`);
module.exports.MessageMenu = require(`./v0.16.x/Classes/MessageMenu`);
module.exports.MessageMenuOption = require(`./v0.16.x/Classes/MessageMenuOption`);
module.exports.MessageActionRow = require('./v0.16.x/Classes/MessageActionRow');
module.exports.MessageComponent = require('./v0.16.x/Classes/MessageComponent');
module.exports.Message = require(`./v0.16.x/Classes/Message`);
module.exports.ButtonCollector = require(`./v0.16.x/Classes/ButtonCollector`);
module.exports.MenuCollector = require(`./v0.16.x/Classes/MenuCollector`);
module.exports.Util = require('./v0.16.x/Util');
module.exports.Constants = require('./v0.16.x/Constants');
