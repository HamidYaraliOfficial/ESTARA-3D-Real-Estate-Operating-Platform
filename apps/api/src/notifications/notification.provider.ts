export interface NotificationProvider { send(input:{to:string;subject:string;body:string}):Promise<void>; }
export class ConsoleNotificationProvider implements NotificationProvider {async send(input:{to:string;subject:string;body:string}){console.log('[notification]',input);}}
