import { EventEmitter } from 'events';

import logger from '../winston';

class STTEventEmitter extends EventEmitter {}

class STTService {

    sttEventEmitter: EventEmitter;
    
    constructor() {
        this.sttEventEmitter = new STTEventEmitter();
    }

    // createEvent(callSid: string) {
    //     logger.debug('create event... '+callSid);
    //     this.sttEventEmitter.on(callSid, (data: string) => logger.debug("STT "+ data));
    // }

    emit(callSid: string, data: string) {
        this.sttEventEmitter.emit(callSid, data);
    }

    listen(callSid: string, timeout: number = 15000) {

        logger.info("Listening... "+callSid);
        return new Promise((resolve: Function, reject: Function) => {

            let timer: NodeJS.Timeout = setTimeout(() => {
                reject("No event was triggered...")
            }, timeout);
            this.sttEventEmitter.on(callSid, (data: string) => {

                clearTimeout(timer);
                resolve(data);
            });
        });
    }

    destroyEvent(callSid: string) {
        this.sttEventEmitter.removeAllListeners(callSid);
    }
}

// const sstService = new STTService();
// export default sstService;
export default STTService;