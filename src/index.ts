import Websocket, { Server } from 'ws';

import sttService from './services/STTService';

console.log("stt using gspeech loaded");

export function init(wss: Server, client: any) {
    
    wss.on('connection', (ws: Websocket, req: any) => {

        console.log("connection on websocket");
        let recognizeStream: any = null;
        let timeout: NodeJS.Timeout;
        const callSid = req.url.substring(1);
        const request = {
            config: {
                encoding: "MULAW",
                sampleRateHertz: 8000,
                languageCode: "en-IN"
            },
            interimResults: true
        };
        sttService.createEvent(callSid);

        ws.on('message', (message: string) => {

            console.log("message event triggered...");
            const msg: any = JSON.parse(message);
            switch(msg.event){
                case 'connected' :
                    
                    console.log("connected to websocket");
                    recognizeStream = client
                    .streamingRecognize(request)
                    .on("error", console.error)
                    .on("data", (data: any) => {
                        console.log(data, "===", data.results[0].alternatives[0].transcript);
                        console.log("clearing timer...", clearTimeout(timeout));
                        
                        timeout = setTimeout(() => {
                            
                            console.log("Stop", callSid);
                            sttService.emit(callSid, data.results[0].alternatives[0].transcript);
                        }, 2000);
                    });
                break;

                case "start":
                    timeout = setTimeout(() => {
                        console.log("Stop start", callSid);
                        sttService.emit(callSid, "");
                    }, 5000);
                    console.log(`Starting Media Stream ${msg.streamSid}`);
                break;

                case "media":
                    // console.log(`Receiving Audio...`)
                    // Write Media Packets to the recognize stream
                    recognizeStream.write(msg.media.payload);
                break;

                case "stop":
                    console.log("clearing timer...", clearTimeout(timeout));
                    console.log(`Call Has Ended`);
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