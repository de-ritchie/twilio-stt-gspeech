import { Server } from 'ws';
export declare function init(wss: Server, client: any, debug?: boolean): void;
export declare function listen(callSid: string, timeout?: number): Promise<unknown>;
