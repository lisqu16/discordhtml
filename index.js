class Client extends HTMLElement {
    constructor() {
        super();
        let mobile;
        let token;
        try {
            token = this.attributes.getNamedItem("token").nodeValue;
        } catch (e) {
            return console.error("a token to gdzie")
        }
        try {
            mobile = this.attributes.getNamedItem("mobile").nodeValue;
        } catch (e) {}

        const message = (msg) => {
            let { t, s, op, d } = JSON.parse(msg.data.toString());
            
            switch (op) {
                case 0:
                    console.log("event "+t)
                    break;
                case 10:
                    setInterval(()=> this.socket.send(JSON.stringify({
                        "op": 1,
                        "d": null
                    })), d.heartbeat_interval);

                    this.socket.send(JSON.stringify({
                        "op": 2,
                        "d": {
                            token,
                            "intents": 513,
                            "properties": {
                                "$os": "linux",
                                "$browser": mobile ? "Discord Android" : "discordhtml",
                                "$device": "discordhtml"
                            },
                            "presence": {
                                "status": "online",
                                "afk": false
                            },
                            "guild_subscriptions": false,
                            "shard": [0, 1]
                        }
                    }));
                    break;
            }
        }

        this.socket = new WebSocket("wss://gateway.discord.gg/?v=8&encoding=json");
        this.socket.onmessage = (msg) => message(msg);
    }
}

customElements.define("dh-client", Client)