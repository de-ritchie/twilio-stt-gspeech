"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var STTService_1 = __importDefault(require("./services/STTService"));
console.log("stt using gspeech loaded");
function init(wss, client) {
    wss.on('connection', function (ws, req) {
        console.log("connection on websocket");
        var recognizeStream = null;
        var timeout;
        var callSid = req.url.substring(1);
        var request = {
            config: {
                encoding: "MULAW",
                sampleRateHertz: 8000,
                languageCode: "en-IN"
            },
            interimResults: true
        };
        STTService_1.default.createEvent(callSid);
        ws.on('message', function (message) {
            console.log("message event triggered...");
            var msg = JSON.parse(message);
            switch (msg.event) {
                case 'connected':
                    console.log("connected to websocket");
                    recognizeStream = client
                        .streamingRecognize(request)
                        .on("error", console.error)
                        .on("data", function (data) {
                        console.log(data, "===", data.results[0].alternatives[0].transcript);
                        console.log("clearing timer...", clearTimeout(timeout));
                        timeout = setTimeout(function () {
                            console.log("Stop", callSid);
                            STTService_1.default.emit(callSid, data.results[0].alternatives[0].transcript);
                        }, 2000);
                    });
                    break;
                case "start":
                    timeout = setTimeout(function () {
                        console.log("Stop start", callSid);
                        STTService_1.default.emit(callSid, "");
                    }, 5000);
                    console.log("Starting Media Stream " + msg.streamSid);
                    break;
                case "media":
                    // console.log(`Receiving Audio...`)
                    // Write Media Packets to the recognize stream
                    recognizeStream.write(msg.media.payload);
                    break;
                case "stop":
                    console.log("clearing timer...", clearTimeout(timeout));
                    console.log("Call Has Ended");
                    STTService_1.default.destroyEvent(callSid);
                    recognizeStream.destroy();
                    break;
            }
        });
    });
}
exports.init = init;
function listen(callSid, timeout) {
    return STTService_1.default.listen(callSid, timeout);
}
exports.listen = listen;
//# sourceMappingURL=index.js.map