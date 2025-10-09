class VerifyEmailPayload {
  constructor(payload) {
    this._verifyPayload(payload);

    const { email, code } = payload;
    this.email = email.trim().toLowerCase();
    this.code = code;
  }

  _verifyPayload({ email, code }) {
    if (!email || !code) {
      throw new Error('VERIFY_EMAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof email !== 'string' || typeof code !== 'string') {
      throw new Error('VERIFY_EMAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (typeof email === 'string' && email.trim().length === 0) {
      throw new Error('VERIFY_EMAIL.EMAIL_INVALID');
    }

    if (!/^\d{4}$/.test(code)) {
      throw new Error('VERIFY_EMAIL.CODE_NOT_VALID');
    }
  }
}

export default VerifyEmailPayload;
