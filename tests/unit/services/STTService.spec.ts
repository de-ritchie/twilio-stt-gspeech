import STTService from '../../../src/services/STTService';
import { EventEmitter } from 'events';

describe('Speech to text Service', () => {

    let sttService: STTService;
    let callSid = "callSid";
    let data = "where are you located";

    beforeEach(() => {
        sttService = new STTService();
    });

    it("Check event emitter is created", () => {

        expect(sttService.sttEventEmitter).toBeInstanceOf(EventEmitter);
    });

    it("Listen to event gets timeout", () => {

        sttService.listen("callSid")
        .catch((err) => {
            expect(err).toContain("No event was triggered...");
        });
    });

    it("Listen to emitted event", () => {

        sttService.listen(callSid)
        .then((res) => {
            expect(res).toContain(data);
        });
        sttService.emit(callSid, data);
    });

    it("Destroy an event", () => {

        sttService.listen(callSid)
        .then((res) => {
            expect(res).toContain(data);
        });
        expect(sttService.sttEventEmitter.listenerCount(callSid)).toEqual(1);
        sttService.destroyEvent(callSid);
        expect(sttService.sttEventEmitter.listenerCount(callSid)).toEqual(0);
    });
});