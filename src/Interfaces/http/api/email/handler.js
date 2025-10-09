import { Receiver } from '@upstash/qstash';
import nodemailer from 'nodemailer';
import { config } from '../../../../Utils/config.js';

class EmailHandler {
  constructor() {
    this._receiver = new Receiver({
      currentSigningKey: config.qstash.currentSigning,
      nextSigningKey: config.qstash.nextSigning,
    });

    this._transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465, // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });

    this.postEmailVerificationHandler = this.postEmailVerificationHandler.bind(this);
  }

  async postEmailVerificationHandler(request, h) {
    try {
      const signature = request.headers['upstash-signature'];
      const body = request.payload;

      const isValid = await this._receiver.verify({
        signature,
        body: JSON.stringify(body),
      });

      if (!isValid) {
        return h.response({ message: 'Invalid signature' }).code(401);
      }

      const { to, name, code } = body;

      const mailOptions = {
        from: config.email.from,
        to,
        subject: config.email.verificationSubject,
        html: `Hi ${name},<br><br>Your verification code is: <b>${code}</b><br><br>This code will expire in ${config.email.verificationTtlMinutes} minutes.<br><br>Thanks,<br>The Team`,
      };

      await this._transporter.sendMail(mailOptions);

      return h.response({ message: 'Email sent successfully' }).code(200);
    } catch (error) {
      console.error('Error processing email verification:', error);
      return h.response({ message: 'Internal Server Error' }).code(500);
    }
  }
}

export default EmailHandler;
