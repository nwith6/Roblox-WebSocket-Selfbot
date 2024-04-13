# Roblox WebSocket Selfbot

## What is this bot?
This bot sends requests to multiple roblox endpoints to find out the web sockets for roblox servers. The bot has 4 commands, `/getservers`, `/getplayer`, `/whitelist add`, and `whitelist remove`. The first command takes a game url and outputs upto 25 pieces of server data including the web socket. The second command takes a player username and will attempt to get that specific players server and output the server data, including the web socket. The third command adds a user either through userid or a MentionableObject to the bot whitelist. The fourth command is very similar to the third but instead removes them from the whitelist.

Unlike the previous bots, this one has a protected server bypass in it! This will likely be my most maintained repo, so for any updates refer to this repository, thank you!

## Examples
![/getservers](https://github.com/nwith6/Roblox-WebSocket-Selfbot/assets/79481053/029b66e6-43c9-459b-9636-098b19006571)


![/getplayer](https://github.com/nwith6/Roblox-WebSocket-Selfbot/assets/79481053/5d0044d9-ec2f-480a-9353-d2db5fe6ad60)


![/whitelist add](https://github.com/nwith6/Roblox-WebSocket-Selfbot/assets/79481053/39d0da61-5460-41ca-8009-23352189f881)


![/whitelist remove](https://github.com/nwith6/Roblox-WebSocket-Selfbot/assets/79481053/5c25c315-ba57-423c-bfae-f92ba10feb04)


## How to get started
1. Clone this repo into a new workspace.
2. run `npm install` to install all the required dependencies.
3. Correctly fill out all the entries inside `config.json`
4. In your terminal run `npm run deploy` to deploy your commands and begin running the bot.
5. Now all you have to do from here is run the commands which are slash commands. To do this go to any text channel/direct message/group chat and type `/getservers url: <game_url>` or `/getplayer username: <username>`. If instead you want to (un)whitelist someone, obviously just run the whitelist commands!

## Other Versions
[Python Version](https://github.com/nwith6/Python-Roblox-WebSocket-Bot)
[Javascript Version](https://github.com/nwith6/Roblox-WebSocket-Bot)

# If you need any help contact me @ widespread. on discord.
