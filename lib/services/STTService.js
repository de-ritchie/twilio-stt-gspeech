"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var winston_1 = __importDefault(require("../winston"));
var STTEventEmitter = /** @class */ (function (_super) {
    __extends(STTEventEmitter, _super);
    function STTEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return STTEventEmitter;
}(events_1.EventEmitter));
var STTService = /** @class */ (function () {
    function STTService() {
        this.sttEventEmitter = new STTEventEmitter();
    }
    // createEvent(callSid: string) {
    //     logger.debug('create event... '+callSid);
    //     this.sttEventEmitter.on(callSid, (data: string) => logger.debug("STT "+ data));
    // }
    STTService.prototype.emit = function (callSid, data) {
        this.sttEventEmitter.emit(callSid, data);
    };
    STTService.prototype.listen = function (callSid, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 15000; }
        winston_1.default.info("Listening... " + callSid);
        return new Promise(function (resolve, reject) {
            var timer = setTimeout(function () {
                reject("No event was triggered...");
            }, timeout);
            _this.sttEventEmitter.on(callSid, function (data) {
                clearTimeout(timer);
                resolve(data);
            });
        });
    };
    STTService.prototype.destroyEvent = function (callSid) {
        this.sttEventEmitter.removeAllListeners(callSid);
    };
    return STTService;
}());
// const sstService = new STTService();
// export default sstService;
exports.default = STTService;
//# sourceMappingURL=STTService.js.map