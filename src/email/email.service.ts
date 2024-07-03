import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
  private client: postmark.ServerClient;

  constructor(private readonly configService: ConfigService) {
    const postmarkServerApiKey = this.configService.get<string>(
      'POSTMARK_SERVER_API_KEY',
    );
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
