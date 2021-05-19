<div align="center">

  <p>
    <a href="https://www.npmjs.com/package/discord-buttons"><img src="https://img.shields.io/npm/v/discord-buttons?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-buttons"><img src="https://img.shields.io/npm/dt/discord-buttons?maxAge=3600" alt="NPM downloads" /></a>
  </p>

  <p>
    <a href="https://www.npmjs.com/package/discord-buttons"><img src="https://nodei.co/npm/discord-buttons.png?downloads=true&stars=true" alt="NPM Banner"></a>
  </p>

  <img src="http://pays.host/uploads/390c2d6f-7281-4ebd-9429-5dbff5bcee44/RBcQvq7V_.png">
  <br> <br>
</div>

## Install
```sh
$ npm i discord-buttons
```
## Setup
```js
const discord = require('discord.js'); //Define the discord.js module
const client = new discord.Client(); //Creating discord.js client (constructor)

require('discord-buttons')(client); //Starting the discord-buttons class
//or if you want to use MessageButton class
const disbut = require('discord-buttons')(client);
//or if you use just "require('discord-buttons')(client);"
const { MessageButton } = require('discord-buttons');
```

<br />

## [Documentation](https://angelocore.gitbook.io/discord-buttons)

<br />

## Example with `MessageButton`
```js
let button = new disbut.MessageButton()
  .setStyle('red') //default: blurple
  .setLabel('My First Button!') //default: NO_LABEL_PROVIDED
  .setID('click_to_function') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
  .setDisabled(); //disables the button | default: false

message.channel.send('Hey, i am powered by https://npmjs.com/discord-buttons', button);
```

### Multiple Buttons
```js
let button = new disbut.MessageButton()
  .setStyle('red') //default: blurple
  .setLabel('My First Button!') //default: NO_LABEL_PROVIDED
  .setID('click_to_function') //note: if you use the style "url" you must provide url using .setURL('https://example.com')
  .setDisabled(); //disables the button | default: false

let button2 = new disbut.MessageButton()
  .setStyle('url') //default: blurple
  .setLabel('My Second Button!') //default: NO_LABEL_PROVIDED
  .setURL('[click_to_function](https://npmjs.com/discord-buttons)') //note: if you use other style you must provide id using .setID('myid')

message.channel.send('Hey, i am powered by https://npmjs.com/discord-buttons', {
  buttons: [
    button, button2
  ]
});
```

## Example
```js
message.buttons('Hello World!', {
  buttons: [
    {
      style: 'green',
      label: 'Click to function!',
      id: 'click_to_function'
    },
    {
      style: 'url',
      label: 'Vote for me!',
      url: 'https://npmjs.com/top.gg-core'
    }
  ]
})
```

## When button is clicked
```js
client.on('clickButton', button => {
    if (button.id === 'click_to_function') {
      button.message.channel.send(button.clicker.user.tag)
    }
});
```

## Note: don't forgot to put `require('discord-buttons')(client)` after your client

<br>

## Documentation
Checkout more examples on our [docs](https://angelocore.gitbook.io/discord-buttons)

<br>

## Don't see the buttons?
The buttons are beta, so to see them you have to be a discord-tester or just wait for the update

<br>

> For any questions or errors, join in our server and report the bug on the #errors channel https://discord.gg/5JtyYqW

<hr>

## Contact

[Youtube](https://www.youtube.com/channel/UCxxK71QFN4_PrBhCFmH2Jmw), [Discord](https://discord.gg/5JtyYqW)