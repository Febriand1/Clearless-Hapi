import AuthorizationError from './AuthorizationError.js';
import InvariantError from './InvariantError.js';

const DomainErrorTranslator = {
  translate(error) {
    const mapped = DomainErrorTranslator._directories[error.message];
    if (!mapped) return error;
    if (typeof mapped === 'function') return mapped();
    return mapped;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),

  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password',
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string',
  ),

  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),

  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),

  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
  ),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai',
  ),

  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
  ),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
  ),

  'DELETE_COMMENT.NOT_CONTAIN_NEEDED_PARAMETER': new InvariantError(
    'harus mengirimkan threadId dan commentId',
  ),
  'DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'threadId, commentId dan owner harus string',
  ),

  'THREAD_ID.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
  ),
  'THREAD_ID.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai',
  ),

  'COMMENT_ID.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada',
  ),
  'COMMENT_ID.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
  ),

  'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada',
  ),
  'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat balasan baru karena tipe data tidak sesuai',
  ),

  'DELETE_REPLY.NOT_CONTAIN_NEEDED_PARAMETER': new InvariantError(
    'harus mengirimkan threadId, commentId, dan replyId',
  ),
  'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'commentId, threadId, replyId, dan owner harus string',
  ),

  'REPLY_ID.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada',
  ),
  'REPLY_ID.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat balasan baru karena tipe data tidak sesuai',
  ),

  'VALIDATION_REPLY.NOT_THE_OWNER': new AuthorizationError(
    'anda bukan pemilik balasan ini',
  ),
  'VALIDATION_COMMENT.NOT_THE_OWNER': new AuthorizationError(
    'anda bukan pemilik komentar ini',
  ),

  'NEW_LIKE.NOT_CONTAIN_NEEDED_PARAMETER': new InvariantError(
    'tidak dapat membuat like baru karena parameter yang dibutuhkan tidak ada',
  ),
  'NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat like baru karena tipe data tidak sesuai',
  ),
  ' NEW_LIKE.INVALID_TYPE': new InvariantError(
    'tidak dapat membuat like baru karena tipe likeableType tidak valid',
  ),
  'UPDATE_USER.NO_FIELD_PROVIDED': () =>
    new InvariantError('tidak ada field yang dikirimkan untuk diubah'),
};

export default DomainErrorTranslator;
