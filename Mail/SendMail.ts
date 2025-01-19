import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter:nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your SMTP host
      auth: {
        user: process.env.email, // Your SMTP username
        pass: process.env.email_password, // Your SMTP password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    console.log("Email: ",to);
    const mailOptions = {
      from: process.env.email, 
      to:to, 
      subject, // Subject
      text, // Plain text body
      html, // HTML body (optional)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
