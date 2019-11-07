"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var options = {
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};
var logger = winston_1.createLogger({
    transports: [
        new winston_1.transports.Console(options.console)
    ]
});
exports.default = logger;
//# sourceMappingURL=index.js.map