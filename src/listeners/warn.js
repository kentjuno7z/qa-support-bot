const EventListener = require("../modules/listeners/listener");

module.exports = class WarnEventListener extends EventListener {
    constructor(client) {
        super(client, { event: "warn" });
    }

    async execute(warning) {
        log.warn(warning);
    }
};
