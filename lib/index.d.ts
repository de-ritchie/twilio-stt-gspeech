import { Server } from 'ws';
export declare function init(wss: Server, client: any): void;
export declare function listen(callSid: string, timeout?: number): Promise<unknown>;
