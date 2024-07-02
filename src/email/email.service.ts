import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
  private client = new postmark.ServerClient('your-postmark-server-api-key');

  async sendEmail(to: string, subject: string, text: string) {
    await this.client.sendEmail({
      From: 'your-email@example.com',
      To: to,
      Subject: subject,
      TextBody: text,
    });
  }
}
