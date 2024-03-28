import { injectable } from 'tsyringe';
import { IQueueProvider } from '../queue.provider.interface';
import amqplib, { Channel, Connection } from 'amqplib';

@injectable()
export class RabbiMqProvider implements IQueueProvider {
  private rabbittMqClient: Connection;
  private channel: Channel
  private subscribers: Array<{
    queue: string;
    fn: (message: any) => any
  }> = [];

  constructor() {
    this.startConnection();
  }
  
  private async startConnection() {
    this.rabbittMqClient = await amqplib.connect(`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_DEFAULT_HOST}/${process.env.RABBITMQ_DEFAULT_VHOST}`);
    this.channel = await this.rabbittMqClient.createChannel();

    this.subscribers.forEach(({ fn, queue }) => {
      this.channel.assertQueue(queue, {
        durable: true,
      });
      
      this.channel.consume(queue, (message) => {
        if (message) {
          const parsedMessage = JSON.parse(message.content.toString());
          fn(parsedMessage)
        }
      }, {
        noAck: true,
      })
    })
  }
  
  async sendMessage(queue: string, message: any[] | Record<any, any>): Promise<void> {
    const messageStringified = JSON.stringify(message);

    this.channel.sendToQueue(queue, Buffer.from(messageStringified));
  }

  async subscribe(queue: string, serviceFunction: (message: any) => Promise<any> | any): Promise<void> {
    this.subscribers.push({
      queue,
      fn: serviceFunction
    });
  }
}
