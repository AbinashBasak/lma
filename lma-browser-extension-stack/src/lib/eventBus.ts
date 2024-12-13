import { Subject } from 'rxjs';

export type EventType = 'clear' | 'update';
export interface EventPayload {
    eventType: EventType;
    data?: any;
}

export const eventBus$ = new Subject<EventPayload>();
