import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';
import { IConfiguration } from 'src/config/configuration';

@Injectable()
export class EmailService {
  private client: postmark.ServerClient;

  constructor(private readonly configService: ConfigService<IConfiguration>) {
    const postmarkServerApiKey = this.configService.get('postmark.apiKey', {
      infer: true,
    });
    this.client = new postmark.ServerClient(postmarkServerApiKey);
  }

  async sendEmail(to: string, subject: string, text: string) {
    await this.client.sendEmail({
      From: 'your-email@example.com',
      To: to,
      Subject: subject,
      TextBody: text,
    });
  }
}
