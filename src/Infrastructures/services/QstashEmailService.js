import { Client } from '@upstash/qstash';
import EmailService from '../../Applications/services/EmailService.js';

class QstashEmailService extends EmailService {
  constructor(options = {}) {
    super();
    const { token, targetUrl, subject, from, verificationTtlMinutes, baseUrl } =
      options;

    if (!token) {
      throw new Error('QSTASH_EMAIL_SERVICE.MISSING_TOKEN');
    }

    if (!targetUrl) {
      throw new Error('QSTASH_EMAIL_SERVICE.MISSING_DESTINATION');
    }

    this._client = new Client({
      token,
      ...(baseUrl ? { baseUrl } : {}),
    });

    this._targetUrl = targetUrl;
    this._subject =
      subject ||
      'Kode Verifikasi Email Clearless Forum'; /* default subject fallback */
    this._from = from || 'no-reply@clearless-forum.local';
    this._verificationTtlMinutes = verificationTtlMinutes || 10;
  }

  async sendVerificationEmail({ to, code, name }) {
    if (!to || !code) {
      throw new Error('EMAIL_SERVICE.INVALID_PAYLOAD');
    }

    const payload = {
      type: 'email_verification',
      to,
      name,
      subject: this._subject,
      from: this._from,
      code,
      ttlMinutes: this._verificationTtlMinutes,
      requestedAt: new Date().toISOString(),
    };

    const publishPayload = {
      body: payload,
      delay: 10,
    };

    if (this._headers && Object.keys(this._headers).length > 0) {
      publishPayload.headers = { 'Content-Type': 'application/json' };
    }

    if (this._targetUrl) {
      publishPayload.url = this._targetUrl;
    }

    try {
      console.info(
        `[QSTASH] Publishing verification email for: ${to} at ${new Date().toISOString()}`
      );
      const { messageId } = await this._client.publishJSON(publishPayload);
      console.info(
        `[QSTASH] Successfully published verification email for: ${to} with messageId: ${messageId} at ${new Date().toISOString()}`
      );
    } catch (error) {
      console.error(
        `[QSTASH] Failed to publish verification email for: ${to}`,
        error
      );
      throw error;
    }
  }
}

export default QstashEmailService;
