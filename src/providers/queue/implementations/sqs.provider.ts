import { injectable } from 'tsyringe';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"; 
import { ForbiddenException } from '../../../errors/exceptions/forbidden.exception';
import { IQueueProvider } from '../queue.provider.interface';

@injectable()
export class SqsProvider implements IQueueProvider {
  private sqsClient: SQSClient;

  constructor() {
    if (!process.env.AWS_SQS_ACCESS_KEY || !process.env.AWS_SQS_SECRET_ACCESS_KEY || !process.env.AWS_SQS_REGION) {
      throw new ForbiddenException('enviroments AWS_SQS_ACCESS_KEY, AWS_SQS_SECRET_ACCESS_KEY and AWS_SQS_REGION is required.')
    };
    // mudar pra um container do rabbitMQ ou kafka, para evitar colocar as credenciais
    this.sqsClient = new SQSClient({
      credentials: {
        accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SQS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_SQS_REGION
    })
  }

  async sendMessage(queueUrl: string, message: string | number | any[] | Record<any, any>): Promise<void> {
    const messageString = JSON.stringify(message);
    
    await this.sqsClient.send(new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: messageString,
    }))
  }

  async subscribe(queue: string, serviceFunction: (message: any) => any): Promise<void> {
    // implementar?
  }
}
