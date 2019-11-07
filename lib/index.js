"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("./config"));
var winston_1 = __importDefault(require("./winston"));
var container_1 = require("./container");
function init(wss, client, debug) {
    if (debug === void 0) { debug = false; }
    if (debug)
        winston_1.default.transports[0].silent = !debug;
    winston_1.default.info('twilio speech to text using gspeech API is loaded');
    wss.on('connection', function (ws, req) {
        winston_1.default.debug("connection on websocket " + config_1.default.languageCode);
        var recognizeStream = null;
        var timeout;
        var split = req.url.split('/');
        winston_1.default.debug(split);
        var callSid = split[1];
        var languageCode = split[2] || config_1.default.languageCode;
        winston_1.default.debug("adsasa" + callSid + "language " + languageCode);
        var request = {
            config: {
                encoding: "MULAW",
                sampleRateHertz: 8000,
                languageCode: languageCode
            },
            interimResults: true
        };
        ws.on('message', function (message) {
            var msg = JSON.parse(message);
            switch (msg.event) {
                case 'connected':
                    winston_1.default.debug("connected to websocket");
                    recognizeStream = client
                        .streamingRecognize(request)
                        .on("error", console.error)
                        .on("data", function (data) {
                        winston_1.default.debug(data);
                        winston_1.default.debug("clearing timer...");
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            winston_1.default.debug("Stop " + callSid);
                            container_1.sttService.emit(callSid, data.results[0].alternatives[0].transcript);
                        }, 2000);
                    });
                    break;
                case "start":
                    timeout = setTimeout(function () {
                        winston_1.default.debug("Stop " + callSid);
                        container_1.sttService.emit(callSid, "");
                    }, 5000);
                    winston_1.default.debug("Starting Media Stream " + msg.streamSid);
                    break;
                case "media":
                    // logger.debug(`Receiving Audio...`)
                    // Write Media Packets to the recognize stream
                    recognizeStream.write(msg.media.payload);
                    break;
                case "stop":
                    winston_1.default.debug("clearing timer...");
                    clearTimeout(timeout);
                    winston_1.default.debug("Call Has Ended");
                    container_1.sttService.destroyEvent(callSid);
                    recognizeStream.destroy();
                    break;
            }
        });
    });
}
exports.init = init;
function listen(callSid, timeout) {
    return container_1.sttService.listen(callSid, timeout);
}
exports.listen = listen;
//# sourceMappingURL=index.js.map