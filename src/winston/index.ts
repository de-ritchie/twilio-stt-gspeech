import { createLogger, transports } from 'winston';

const options = {
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
};

let logger = createLogger({
    transports: [
        new transports.Console(options.console)
    ]
});

export default logger;