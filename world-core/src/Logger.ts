import * as logger from 'winston';

export const Logger = logger.createLogger({
    transports: [
        new logger.transports.Console()
    ],
    level: 'debug'
});
