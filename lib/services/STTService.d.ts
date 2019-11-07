/// <reference types="node" />
import { EventEmitter } from 'events';
declare class STTService {
    sttEventEmitter: EventEmitter;
    constructor();
    emit(callSid: string, data: string): void;
    listen(callSid: string, timeout?: number): Promise<unknown>;
    destroyEvent(callSid: string): void;
}
export default STTService;
