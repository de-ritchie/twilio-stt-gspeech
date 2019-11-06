/// <reference types="node" />
import { EventEmitter } from 'events';
declare class STTService {
    sttEventEmitter: EventEmitter;
    constructor();
    createEvent(callSid: string): void;
    emit(callSid: string, data: string): void;
    listen(callSid: string, timeout?: number): Promise<unknown>;
    destroyEvent(callSid: string): void;
}
declare const _default: STTService;
export default _default;
