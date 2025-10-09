import { Client } from '@upstash/qstash';
import EmailService from '../../Applications/services/EmailService.js';

class QstashEmailService extends EmailService {
  constructor(options = {}) {
    super();
    const {
      token,
      targetUrl,
      topic,
      subject,
      from,
      verificationTtlMinutes,
      baseUrl,
      headers,
    } = options;

    if (!token) {
      throw new Error('QSTASH_EMAIL_SERVICE.MISSING_TOKEN');
    }

    if (!targetUrl && !topic) {
      throw new Error('QSTASH_EMAIL_SERVICE.MISSING_DESTINATION');
    }

    this._client = new Client({
      token,
      ...(baseUrl ? { baseUrl } : {}),
    });

    this._targetUrl = targetUrl;
    this._topic = topic;
    this._subject =
      subject ||
      'Kode Verifikasi Email Clearless Forum'; /* default subject fallback */
    this._from = from || 'no-reply@clearless-forum.local';
    this._verificationTtlMinutes = verificationTtlMinutes || 10;
    this._headers = headers || { 'Content-Type': 'application/json' };
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
    };

    if (this._headers && Object.keys(this._headers).length > 0) {
      publishPayload.headers = this._headers;
    }

    if (this._topic) {
      publishPayload.topic = this._topic;
    } else {
      publishPayload.url = this._targetUrl;
    }

    await this._client.publishJSON(publishPayload);
  }
}

export default QstashEmailService;
