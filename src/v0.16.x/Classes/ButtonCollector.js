const Collector = require("./interfaces/Collector");

class ButtonCollector extends Collector {
  constructor(data, filter, options = {}) {
    super(data.client, filter, options);

    this.message = data;

    this.users = new Map();

    this.total = 0;

    this.empty = this.empty.bind(this);
    this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
    this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
    this._handleMessageDeletion = this._handleMessageDeletion.bind(this);

    this.client.incrementMaxListeners();
    this.client.on("clickButton", this.handleCollect);
    this.client.on("messageDelete", this._handleMessageDeletion);
    this.client.on("channelDelete", this._handleChannelDeletion);
    this.client.on("guildDelete", this._handleGuildDeletion);

    this.once("end", () => {
      this.client.removeListener("clickButton", this.handleCollect);
      this.client.removeListener("messageDelete", this._handleMessageDeletion);
      this.client.removeListener("channelDelete", this._handleChannelDeletion);
      this.client.removeListener("guildDelete", this._handleGuildDeletion);
      this.client.decrementMaxListeners();
    });

    this.on("collect", (button) => {
      this.total++;
      this.users.set(button.member.id, button.member.user);
    });
  }

  collect(button) {
    if (this.message) {
      return button.message.id === this.message.id ? button.discordID : null;
    }
    return button.channel.id === this.channel.id ? button.discordID : null;
  }

  dispose(button) {
    if (this.message) {
      return button.message.id === this.message.id ? button.discordID : null;
    }
    return button.channel.id === this.channel.id ? button.discordID : null;
  }

  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  endReason() {
    if (this.options.max && this.total >= this.options.max) return "limit";
    if (this.options.maxButtons && this.collected.size >= this.options.maxButtons) return "buttonLimit";
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return "userLimit";
    return null;
  }

  _handleMessageDeletion(message) {
    if (message.id === this.message.id) {
      this.stop("messageDelete");
    }
  }

  _handleChannelDeletion(channel) {
    if (channel.id === this.message.channel.id) {
      this.stop("channelDelete");
    }
  }

  _handleGuildDeletion(guild) {
    if (this.message.guild && guild.id === this.message.guild.id) {
      this.stop("guildDelete");
    }
  }
}

module.exports = ButtonCollector;
