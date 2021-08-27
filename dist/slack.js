"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IncomingWebhook = require('@slack/webhook').IncomingWebhook;
var SlackAPI = (function () {
    function SlackAPI() {
    }
    SlackAPI.prototype.send = function (payload, webhookUrl) {
        var slackWebHook = new IncomingWebhook(webhookUrl);
        if (typeof payload === 'string') {
            payload = { text: payload };
        }
        return slackWebHook.send(payload);
    };
    return SlackAPI;
}());
exports.default = SlackAPI;
//# sourceMappingURL=slack.js.map