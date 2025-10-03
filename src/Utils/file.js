import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import InvariantError from '../Commons/exceptions/InvariantError.js';
import { put, del } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

// ensureUploadsDir tidak diperlukan lagi
function ensureUploadsDir() {}

function isAllowedMime(mime) {
  return ALLOWED_MIME.includes(mime);
}

function getExtFromMime(mime) {
  const parts = mime.split('/');
  if (parts.length !== 2) return null;
  const sub = parts[1] === 'jpeg' ? 'jpg' : parts[1];
  return sub;
}

// saveStreamToFile tidak diperlukan lagi
async function saveStreamToFile() {
  throw new Error(
    'saveStreamToFile is deprecated. Use saveUploadedAvatar instead.',
  );
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
  // Upload ke Vercel Blob
  const blob = await put(filename, fileStream, {
    access: 'public',
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  // blob.url adalah URL file di Vercel Blob
  return blob.url;
}

// deleteUploadedFile untuk blob tidak diimplementasikan (opsional, bisa pakai API Vercel Blob jika perlu)
function deleteUploadedFile(relativeUrl) {
  if (!relativeUrl || typeof relativeUrl !== 'string') return false;

  // Jika URL (mis. https://...), coba hapus di Vercel Blob (fire-and-forget)
  if (/^https?:\/\//i.test(relativeUrl)) {
    (async () => {
      try {
        await del(relativeUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (e) {
        // jangan lempar error ke caller; log jika perlu
        // console.error('Failed to delete blob:', e);
      }
    })();
    return true;
  }
}

export {
  saveUploadedAvatar,
  isAllowedMime,
  ensureUploadsDir,
  MAX_SIZE,
  deleteUploadedFile,
};
