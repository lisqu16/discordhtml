document.body.innerHTML += `<style>
body {
    font-family: 'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, "Helvetica Neue", "Helvetica", Arial, Tahoma, Geneva, Verdana, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
#log {
    background-color: #e5e9f0;
    max-width: 300px;
    min-height: 290px;
    padding-top: 10px;
    text-align: center;
    font-size: 1.5rem;
    display: block;
}
</style>
<div class="dashboard">
    <h1>DiscordHTML</h1>
    <h3>Logi:</h3>
    <span id="log">
    </span>
</div>`;

class Client extends HTMLElement {
    constructor() {
        super();
        let mobile;
        let token;
        try {
            token = this.attributes.getNamedItem("token").nodeValue;
        } catch (e) {
            document.querySelector("#log").innerHTML = "a token to gdzie?" + document.querySelector("#log").innerHTML;
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
        document.querySelector("#log").innerHTML += "Połączono!";
    }
}

customElements.define("dh-client", Client)
