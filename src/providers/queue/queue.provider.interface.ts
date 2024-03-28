export interface IQueueProvider {
  sendMessage(queue: string, message: string | number | Array<any> | Record<any, any>): Promise<void>;
  subscribe(queue: string, serviceFunction: (message: any) => Promise<any> | any): Promise<void>;
}