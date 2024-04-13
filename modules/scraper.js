const { machine } = require("os")
const request = require("request-promise")
const { cookie } = require("../config.json").roblox

class Scraper {

    /**
     * 
     * @param {String} placeId 
     * @returns {Scraper}
     */
    constructor(placeId) {
        this.placeId = placeId
    }

    /**
     * 
     * @param {String} url 
     * @returns {Promise<any>} Promise<Object>
     */
    async #get(url) {
        return await request({
            uri: url,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
                Referer: `https://www.roblox.com/games/`,
                Origin: "https://www.roblox.com/",
                Cookie: `.ROBLOSECURITY=${cookie};path=/;domain=.roblox.com;`
            }
        })
            .then(res => { return res })
            .catch(console.error)
    }

    /**
     * @param {String} url 
     * @param {Array} payload
     * @returns {Promise<Object>} Promise<Object>
     */
    async #post(url, payload=null) {
        return await request({
            uri: url,
            method: "POST",
            json: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
                "Content-Type": "application/json",
                Referer: `https://www.roblox.com/games/`,
                Origin: "https://www.roblox.com/",
                Accept: "application/json",
                Cookie: `.ROBLOSECURITY=${cookie};path=/;domain=.roblox.com;`
            },
            body: payload
        })
            .then(res => { return res })
            .catch(console.error)
    }

    /**
     * 
     * @param {String} url 
     * @param {Array} payload
     * @returns {Promise<Object>} Promise<Object>
     */
    async #postGameJoin(url, payload) {
        return await request({
            uri: url,
            method: "POST",
            json: true,
            headers: {
                "User-Agent": "Roblox/WinInet",
                Referer: `https://www.roblox.com/games/${this.placeId}/`,
                Origin: "https://www.roblox.com/",
                Cookie: `.ROBLOSECURITY=${cookie};path=/;domain=.roblox.com;`
            },
            body: payload
        })
            .then(res => { return res })
            .catch(console.error)
    }

    #handleReponse(response, toParse) {
        try {
            if (!response || !toParse) return response
            else if (toParse) return JSON.parse(response)
        } catch (error) {
            console.error(error)
            return undefined
        }
    }

    /**
     * 
     * @returns {Promise<any>} Promise<Object or undefined>
     */
    async #servers() {
        return await this.#get(`https://games.roblox.com/v1/games/${this.placeId}/servers/Public?sortOrder=Desc&excludeFullGames=true&limit=25`)
            .then(res => { return this.#handleReponse(res, true) })
            .catch(console.error)
    }

    /**
     * 
     * @returns {Promise<any>} Promise<Object or undefined>
     */
    async #placeDetails() {
        return await this.#get(`https://games.roblox.com/v1/games/multiget-place-details?placeids=${this.placeId}`)
            .then(res => { return this.#handleReponse(res, true) })
            .catch(console.error)
    }

    /**
     * 
     * @param {String} gameId
     * @returns {Promise<any>} Promise<Object or undefined>
     */
    async #gameInstance(gameId) {
        return await this.#postGameJoin("https://gamejoin.roblox.com/v1/join-game-instance", {
            placeId: this.placeId,
            isTeleport: false,
            gameId: gameId,
            gameJoinAttemptId: gameId
        })
            .then(res => { return this.#handleReponse(res, false) })
            .catch(console.error)
    }
    
    /**
     * 
     * @param {String} username
     * @returns {Promise<any>} Promise<Object or undefined>
     */
    async #userdata(username) {
        return await this.#post("https://users.roblox.com/v1/usernames/users", {
            usernames: [ username ]
        })
            .then(res => { return this.#handleReponse(res, false) })
            .catch(console.error)
    }

    /**
     * 
     * @param {Number} userid
     * @returns {Promise<any>} Promise<Object or undefined>
     */
    async #userpresence(userId) {
        return await this.#post("https://presence.roblox.com/v1/presence/users", {
            userIds: [ userId ]
        })
            .then(res => { return this.#handleReponse(res, false) })
            .catch(console.error)
    }

    /**
     * 
     * @param {String} universeId
     * @returns {Promise<any>} Promise<Object or undefined>
     */
    async #universe(universeId) {
        return await this.#get(`https://games.roblox.com/v1/games?universeIds=${universeId}`)
            .then(res => { return this.#handleReponse(res, true) })
            .catch(console.error)
    }

    /**
     * 
     * @param {String} type "headshot" or "icon"
     * @param {String} arg
     * @returns {Promise<Object>} Promise<Object or undefined>
     */
    async #robloxImageUrl(type, arg) {
        if (type === "headshot") {
            return await this.#get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${arg}&size=48x48&format=Png&isCircular=true`)
            .then(res => { return this.#handleReponse(res, true) })
            .catch(console.error)

        } else { // else if (type === "icon") {
            return await this.#get(`https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${arg}&returnPolicy=0&size=50x50&format=Png&isCircular=true`)
            .then(res => { return this.#handleReponse(res, true) })
            .catch(console.error)
        }
    }

    /**
     * 
     * @param {Object} servers 
     * @returns {Promise<Object>} Promise<Object>
     */
    async #serversdata(servers) {
        const placeDetails = await this.#placeDetails()
        const gameIcon = await this.#robloxImageUrl("icon", placeDetails[0].placeId)
        let pack = {
            data: [],
            maxPlayers: servers.data[0].maxPlayers,
            name: placeDetails[0].name,
            url: placeDetails[0].url,
            gameIconUrl: gameIcon.data[0].imageUrl
        }

        for(let i=0; i < servers.data.length; i++) {
            let server = servers.data[i]

            pack.data.push({
                gameId: server.id,
                playing: server.playing,
                ping: server.ping
            })
        }

        return pack
    }

    /**
     * 
     * @returns {Promise<Object>} Promise<Object>
     */
    async fetchServers() {
        const servers = await this.#servers()
        if (!servers.data || servers.data.length == 0) {
            return {
                error: "Failed to fetch any servers from the given place."
            }
        }

        return await this.#serversdata(servers)
    }

    /**
     * 
     * @param {String} username 
     * @returns {Promise<Object>} Promise<Object>
     */
    async fetchPlayerServer(username) {
        const userdata = await this.#userdata(username)
        if (userdata.data.length == 0) {
            return {
                error: "Failed to fetch any userdata for the given user."
            }
        }

        const userpresence = await this.#userpresence(userdata.data[0].id)
        if (userpresence == undefined) {
            return {
                error: "Failed to fetch any presence data for the giver user."
            }
        } else if (userpresence.userPresences[0].gameId === null || userpresence.userPresences[0].placeId === null) {
            return {
                error: "Failed to fetch the given user's server. This could be becuase the user is currently offline, has their joins off, or an unexpected error has occurred."
            }
        }

        const universe = await this.#universe(userpresence.userPresences[0].universeId)
        const playerHeadshot = await this.#robloxImageUrl("headshot", userdata.data[0].id)
        this.placeId = userpresence.userPresences[0].placeId

        return {
            user: {
                name: userdata.data[0].name,
                display: userdata.data[0].displayName,
                url: `https://www.roblox.com/users/${userdata.data[0].id}/profile`,
                playerHeadshot: playerHeadshot.data[0].imageUrl
            },
            gameId: userpresence.userPresences[0].gameId,
            maxPlayers: universe.data[0].maxPlayers
        }
    }

    /**
     * 
     * @param {Object} gameId
     * @returns {Promise<Object>} Promise<Object>
     */
    async fetchServerSocket(gameId) {
        const gameInstance = await this.#gameInstance(gameId)
        if (!gameInstance.jobId || !gameInstance.joinScript) { return { error: "Failed to fetch", joinScript: gameInstance.joinScript } }

        const machineAddress = gameInstance.joinScript.MachineAddress
        if (machineAddress.startsWith("10.")) {
            const correlation = {
                "10.182.": "128.116.97.33",
                "10.206.": "128.116.5.33",
                "10.60.": "128.116.51.33",
                "10.200.": "128.116.53.33",
                "10.20.": "128.116.50.33",
                "10.202.": "128.116.33.33",
                "10.9.": "128.116.44.33",
                "10.198.": "128.116.31.33",
                "10.194.": "128.116.115.33",
                "10.208.": "128.116.1.33",
                "10.8.": "128.116.95.33",
                "10.196.": "128.116.4.33",
                "10.205.": "128.116.55.33",
                "10.26.": "128.116.63.33",
                "10.18.": "128.116.32.33",
                "10.204.": "128.116.127.33",
                "10.12.": "128.116.95.33",
                "10.17.": "128.116.21.33"

            }
            let pack = { ip: undefined, port: gameInstance.joinScript.ServerPort, joinScript: gameInstance.joinScript }
            
            for (let key in correlation) {
                if (machineAddress.startsWith(key)) {
                    pack.ip = correlation[key];
                    break;
                }
            }
            if (pack.ip === undefined) {
                console.log(machineAddress, gameInstance.joinScript.ServerPort, gameId)
                return { error: "Protected websocket", joinScript: gameInstance.joinScript }
            }
        }

        return {
            ip: machineAddress,
            port: gameInstance.joinScript.ServerPort,
            joinScript: gameInstance.joinScript
        }
    }

    async test() {
        // https://www.roblox.com/games/7991339063/Rainbow-Friends?privateServerLinkCode=23655607904966159848660793107809

        // await this.#get("https://www.roblox.com/games/7991339063/Rainbow-Friends?privateServerLinkCode=23655607904966159848660793107809")
        //     .then(res => console.log(res))

        // await this.#post("https://www.roblox.com/games/7991339063/Rainbow-Friends?privateServerLinkCode=23655607904966159848660793107809")
        //     .then(res => console.log(res))

        await this.#get("")
    }
}

module.exports = {
    Scraper
}