import { nanoid } from 'nanoid';
import InvariantError from '../Commons/exceptions/InvariantError.js';
import { put, del } from '@vercel/blob';
import { config } from './config.js';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

function isAllowedMime(mime) {
  return ALLOWED_MIME.includes(mime);
}

function getExtFromMime(mime) {
  const parts = mime.split('/');
  if (parts.length !== 2) return null;
  const sub = parts[1] === 'jpeg' ? 'jpg' : parts[1];
  return sub;
}

async function saveUploadedAvatar(fileStream, contentType) {
  if (!contentType || !contentType.startsWith('image/')) {
    throw new InvariantError('UNSUPPORTED_MEDIA_TYPE');
  }
  if (!isAllowedMime(contentType)) {
    throw new InvariantError('UNSUPPORTED_MEDIA_TYPE');
  }
  const ext = getExtFromMime(contentType) || 'bin';
  const filename = `avatar-${nanoid()}.${ext}`;
  const blob = await put(filename, fileStream, {
    access: 'public',
    contentType,
    token: config.vercel.blob,
  });
  return blob.url;
}

function deleteUploadedFile(relativeUrl) {
  if (!relativeUrl || typeof relativeUrl !== 'string') return false;

  if (/^https?:\/\//i.test(relativeUrl)) {
    (async () => {
      try {
        await del(relativeUrl, { token: config.vercel.blob });
      } catch (e) {}
    })();
    return true;
  }
}

export { saveUploadedAvatar, isAllowedMime, MAX_SIZE, deleteUploadedFile };
