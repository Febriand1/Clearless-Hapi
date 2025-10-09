class RegisteredUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, fullname, email, avatar, is_email_verified } =
      payload;

    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.avatar = avatar || null;
    this.emailVerified = Boolean(is_email_verified);
  }

  _verifyPayload({ id, username, fullname, email }) {
    if (!id || !username || !fullname || !email) {
      throw new Error('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof fullname !== 'string' ||
      typeof email !== 'string'
    ) {
      throw new Error('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default RegisteredUser;
