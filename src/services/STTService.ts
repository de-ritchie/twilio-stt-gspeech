import { EventEmitter } from 'events';

class STTEventEmitter extends EventEmitter {}

class STTService {

    sttEventEmitter: EventEmitter;
    
    constructor() {
        this.sttEventEmitter = new STTEventEmitter();
    }

    createEvent(callSid: string) {
        console.log('create event...', callSid);
        this.sttEventEmitter.on(callSid, (data: string) => console.log("STT", data));
    }

    emit(callSid: string, data: string) {
        this.sttEventEmitter.emit(callSid, data);
    }

    listen(callSid: string, timeout: number = 15000) {

        console.log("Listening...");
        return new Promise((resolve: Function, reject: Function) => {

            let timer: NodeJS.Timeout = setTimeout(() => reject(), timeout);
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

export default new STTService();