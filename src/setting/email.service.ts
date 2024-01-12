import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import * as process from 'process';

@Injectable()
export class EmailService {
  async sendEmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const info = await transporter.sendMail({
      // from: email, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: message, // html body
    });
    return info;
  }
}
