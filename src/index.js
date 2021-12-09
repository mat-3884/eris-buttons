const Eris = require("eris");
const Message = require("./v0.16.x/Classes/Message");
const { MessageComponentTypes } = require("./v0.16.x/Constants");

const version = require("eris").VERSION;

/**
 * @param {Eris.Client} client
 */
module.exports = (client) => {
  if (!version.startsWith("0.16")) {
    throw new Error("The eris version must be v0.16.0 or higher");
  }

  if (!client || !client instanceof Eris.Client) throw new Error("[ERIS-BUTTONS] The Eris Client isn't provided or it's invalid.");

  const message = Eris.Message;
  if (!message.createButtonCollector || typeof message.createButtonCollector !== "function") {
    Object.defineProperty(Eris, "Message", { value: Message });
  }

  client.on("interactionCreate", (interaction) => {
    if (!(interaction instanceof Eris.ComponentInteraction)) return;

    switch (interaction.data.component_type) {
      case MessageComponentTypes.BUTTON:
        client.emit("clickButton", interaction);
        break;

      case MessageComponentTypes.SELECT_MENU:
        client.emit("clickMenu", interaction);
        break;

      default:
        client.emit("debug", `Got unknown interaction component type, ${interaction.data.component_type}`);
        break;
    }
  });
};

module.exports.MessageButton = require(`./v0.16.x/Classes/MessageButton`);
module.exports.MessageSelectMenu = require(`./v0.16.x/Classes/MessageSelectMenu`);
module.exports.MessageSelectMenuOption = require(`./v0.16.x/Classes/MessageSelectMenuOption`);
module.exports.MessageActionRow = require("./v0.16.x/Classes/MessageActionRow");
module.exports.Message = require(`./v0.16.x/Classes/Message`);
module.exports.ButtonCollector = require(`./v0.16.x/Classes/ButtonCollector`);
module.exports.SelectMenuCollector = require(`./v0.16.x/Classes/SelectMenuCollector`);
module.exports.Util = require("./v0.16.x/Util");
module.exports.Constants = require("./v0.16.x/Constants");
