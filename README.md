# EmpatSpeech Silly Fishes

The client for a game about the life under the sea.

if you are looking for the Server look at [this repo](https://github.com/evilpixi/empatspeech-silly-fishes-server).

## Requirements

- [Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.
- `.env` file with a valid `SOCKET_IO_URL`, or a `SOCKET_IO_URL` environment variable that represents the Server.
- A running server.

## Usage
Simply enter to the game url and (assuming you have a configured server running) choose to play as Pacient or Therapist.
If you are a therapist, you can click the fish buttons to spawn fishes in the server.
If you are a pacient you can click on fishes in order to boop them and get new score.
If anything wrong happens you can click the Reset button as a therapist in order to restart the game.

For devs: if you want to implement microphone speech recognition to choose a specific fish, you may want to use this command:
```js
socket.emit(FishEvents.FISH_MARKED_FOR_DELETE, fish_id);
```
to mark the selected fish to be deleted in the server when the speech sound is correct.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch a development web server | serves on `http://localhost:8080` by default.
| `npm run build` | Create a production build in the `dist` folder |
| `npm run dev-nolog` | Launch a development web server without sending anonymous data (see "About log.js" below) |
| `npm run build-nolog` | Create a production build in the `dist` folder without sending anonymous data (see "About log.js" below) |

## Project Structure

We have provided a default project structure to get you started. This is as follows:

- `.env` - Project environment variables.
- `public/index.html` - A basic HTML page to contain the game.
- `src` - Contains the game source code.
- `src/main.ts` - The main entry point. This contains the game configuration and starts the game.
- `src/scenes/` - The Phaser Scenes are in this folder.
- `src/global.d.ts` - Global TypeScript declarations, provide types information.
- `public/style.css` - Some simple CSS rules to help with page layout.
- `public/assets` - Contains the static assets used by the game.

## Deploying to Production

After you run the `npm run build` command, your code will be built into a single bundle and saved to the `dist` folder, along with any other assets your project imported, or stored in the public assets folder.

In order to deploy your game, you will need to upload *all* of the contents of the `dist` folder to a public facing web server.

Then you have to configure a `SOCKET_IO_URL` environment variable, both by a `.env` local file or by your hosting provider variables.

## About log.js

If you inspect our node scripts you will see there is a file called `log.js`. This file makes a single silent API call to a domain called `gryzor.co`. This domain is owned by Phaser Studio Inc. The domain name is a homage to one of our favorite retro games.

We send the following 3 pieces of data to this API: The name of the template being used (vue, react, etc). If the build was 'dev' or 'prod' and finally the version of Phaser being used.

At no point is any personal data collected or sent. We don't know about your project files, device, browser or anything else. Feel free to inspect the `log.js` file to confirm this.

Why do we do this? Because being open source means we have no visible metrics about which of our templates are being used. We work hard to maintain a large and diverse set of templates for Phaser developers and this is our small anonymous way to determine if that work is actually paying off, or not. In short, it helps us ensure we're building the tools for you.

However, if you don't want to send any data, you can use these commands instead:

Dev:

```bash
npm run dev-nolog
```

Build:

```bash
npm run build-nolog
```

Or, to disable the log entirely, simply delete the file `log.js` and remove the call to it in the `scripts` section of `package.json`:

Before:

```json
"scripts": {
    "dev": "node log.js dev & dev-template-script",
    "build": "node log.js build & build-template-script"
},
```

After:

```json
"scripts": {
    "dev": "dev-template-script",
    "build": "build-template-script"
},
```

Either of these will stop `log.js` from running. If you do decide to do this, please could you at least join our Discord and tell us which template you're using! Or send us a quick email. Either will be super-helpful, thank you.




Created by Evilpixi using Phaser Template by [Phaser Studio](mailto:support@phaser.io). Powered by coffee, anime, pixels and love.

All rights reserved.
