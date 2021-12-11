const Eris = require("eris");
const Message = require("./v0.16.x/Classes/Message");
const { MessageComponentTypes } = require("./v0.16.x/Constants");

const version = require("eris").VERSION;

const MessageButton = require(`./v0.16.x/Classes/MessageButton`);
const MessageSelectMenu = require(`./v0.16.x/Classes/MessageSelectMenu`);
const MessageSelectMenuOption = require(`./v0.16.x/Classes/MessageSelectMenuOption`);
const MessageActionRow = require("./v0.16.x/Classes/MessageActionRow");
const ButtonCollector = require(`./v0.16.x/Classes/ButtonCollector`);
const SelectMenuCollector = require(`./v0.16.x/Classes/SelectMenuCollector`);
const Util = require("./v0.16.x/Util");
const Constants = require("./v0.16.x/Constants");

(module.exports = {
  MessageButton,
  MessageSelectMenu,
  MessageSelectMenuOption,
  MessageActionRow,
  Message,
  ButtonCollector,
  SelectMenuCollector,
  Util,
  Constants
}),
  /**
   * @param {Eris.Client} client
   */
  (module.exports = (client) => {
    if (!version.endsWith("16.0")) {
      throw new Error("The eris version must be v0.16.0 or higher");
    }

    if (!client || !client instanceof Eris.Client) throw new Error("INVALID_CLIENT_PROVIDED: The Eris Client isn't provided or it's invalid.");

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
  });
