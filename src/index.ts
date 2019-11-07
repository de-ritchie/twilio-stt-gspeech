import Websocket, { Server } from 'ws';

import config from './config';
import logger from './winston';
import { sttService } from './container';

export function init(wss: Server, client: any, debug: boolean = false) {
    
    if(debug)
        logger.transports[0].silent = !debug;
    
    logger.info('twilio speech to text using gspeech API is loaded');

    wss.on('connection', (ws: Websocket, req: any) => {

        logger.debug("connection on websocket "+config.languageCode);
        
        let recognizeStream: any = null;
        let timeout: NodeJS.Timeout;
        let split = req.url.split('/');
        logger.debug(split);
        const callSid = split[1];
        const languageCode = split[2] || config.languageCode
        logger.debug("adsasa"+callSid+"language "+languageCode);
        const request = {
            config: {
                encoding: "MULAW",
                sampleRateHertz: 8000,
                languageCode: languageCode
            },
            interimResults: true
        };

        ws.on('message', (message: string) => {

            const msg: any = JSON.parse(message);
            switch(msg.event){
                case 'connected' :
                    
                    logger.debug("connected to websocket");
                    recognizeStream = client
                    .streamingRecognize(request)
                    .on("error", console.error)
                    .on("data", (data: any) => {

                        logger.debug(data);
                        logger.debug("clearing timer...");
                        clearTimeout(timeout)
                        
                        timeout = setTimeout(() => {
                            
                            logger.debug("Stop "+callSid);
                            sttService.emit(callSid, data.results[0].alternatives[0].transcript);
                        }, 2000);
                    });
                break;

                case "start":
                    timeout = setTimeout(() => {
                        logger.debug("Stop "+callSid);
                        sttService.emit(callSid, "");
                    }, 5000);
                    logger.debug(`Starting Media Stream ${msg.streamSid}`);
                break;

                case "media":
                    // logger.debug(`Receiving Audio...`)
                    // Write Media Packets to the recognize stream
                    recognizeStream.write(msg.media.payload);
                break;

                case "stop":
                    logger.debug("clearing timer...");
                    clearTimeout(timeout);
                    logger.debug(`Call Has Ended`);
                    sttService.destroyEvent(callSid);
                    recognizeStream.destroy();
                break;
            }
        })
    });
}

export function listen (callSid: string, timeout?: number) {
    
    return sttService.listen(callSid, timeout);
}